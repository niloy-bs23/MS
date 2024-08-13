const express = require("express");
const sendEmail=require("./mail")
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


const createNotifications = catchAsync(async (req, res, next) => {
  const notification = await prisma.notifications.create({
    data: {
      ...req.body,
      date: new Date(),
    },
  });
  console.log(notification);
  res.status(200).json({
    status: "success",
    data: notification,
  });
});
const getAllNotificationsByUserId = catchAsync(async (req, res, next) => {
  const notifications = await prisma.notifications.findMany({
    where: {
      userId: req.params.userId,
    },
  });
  console.log(notifications);
  res.status(200).json({
    status: "success",
    total: notifications.length,
    data: notifications,
  });
});

const router = express.Router();

router.route("/").post(createNotifications);
router.route("/:userId").get(getAllNotificationsByUserId);
// router.post("/send",sendMail)

app.use("/notifications", router);

app.use("*", async (req, res) => {
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

app.listen(3004, () => {
  console.log("running notification service from the port 3004.........");
});

const amqp=require("amqplib");

(async () => {
  try {
    const amqpServer = "amqp://localhost:5672";
    const connection = await amqp.connect(amqpServer);
    const channel = await connection.createChannel();
    await channel.assertQueue("notifications");

    console.log("Waiting for messages...");

    channel.consume("notifications", (message) => {
      const input = JSON.parse(message.content.toString());
      sendEmail(input.email,input.subject,input.message)
      console.log(`email sent to : ${input.email}`);
      channel.ack(message);
    });

    
  } catch (ex) {
    console.error(ex);
  }
})();