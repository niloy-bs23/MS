const express = require("express");
const app = express();

app.use(express.json());

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const catchAsync = (fn) => {
  return (req, res, next) => {
    // console.log(req)
    // console.log(req.method, req.originalUrl, req.body);
    fn(req, res, next).catch(next);
  };
};

const createPayment = catchAsync(async (req, res, next) => {
  // console.log(req.body)
  const payment = await prisma.payments.create({
    data: { ...req.body, paymentDate: new Date() },
  });
  console.log(payment);
  console.log(req.user);
  res.status(200).json({
    status: "message",
    data: payment,
  });
  connectMq({
    email: req.user.email,
    subject: "Payment successed",
    message: "Thank you for payment",
  });
});
const getPaymentInfoById = catchAsync(async (req, res, next) => {
  const payment = await prisma.payments.findUnique({
    where: { paymentId: req.params.paymentId },
  });
  console.log(payment);
  res.status(200).json({
    status: "success",
    data: payment,
  });
});
const getRefunds = catchAsync(async (req, res, next) => {
  const payment = await prisma.payments.update({
    where: { paymentId: req.params.paymentId },
    data: {
      status: "refunded",
    },
  });
  console.log(payment);
  res.status(200).json({
    status: "success",
    data: payment,
  });
});

const router = express.Router();

const axios = require("axios");

const isLoggedIn = catchAsync(async (req, res, next) => {
  let token;

  if (req.get("Authorization")) {
    token = req.get("Authorization").split(" ")[1];
  } else {
    return res.status(200).json({
      status: "failed",
      message: "You're not logged in",
    });
  }

  const response = await axios.post(
    "http://127.0.0.1:3006/auth/isLoggedin",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(response.data);
  if (response.data.status == "success") {
    req.user = response.data.user;
    next();
  } else {
    return res.status(200).json({
      status: "failed",
      message: "You're not logged in",
    });
  }
});

router.route("/").post(isLoggedIn, createPayment);
router.route("/:paymentId").get(isLoggedIn, getPaymentInfoById);
router.route("/refund/:paymentId").post(isLoggedIn, getRefunds);

app.use("/payments", router);

app.use("*", async (req, res, next) => {
  res.status(200).json({
    status: "failed",
    message: "invalid route requested...route doesn't exist",
  });
});

app.use(async (err, req, res, next) => {
  console.log("something error happened", err);
  res.status(200).json({
    status: "falied",
    message: "something error happended...check console log",
  });
});

app.listen(3002, () => {
  console.log("running payment service from the port 3002.........");
});

const amqp = require("amqplib");
const connectMq = async (msg) => {
  try {
    const amqpServer = "amqp://localhost:5672";
    const connection = await amqp.connect(amqpServer);
    const channel = await connection.createChannel();
    await channel.assertQueue("notifications");
    await channel.sendToQueue(
      "notifications",
      Buffer.from(JSON.stringify(msg))
    );
    console.log(`Job sent successfully ${msg.email}`);
    await channel.close();
    await connection.close();
  } catch (ex) {
    console.error(ex);
  }
};
