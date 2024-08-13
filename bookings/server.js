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

const createBookings = catchAsync(async (req, res, next) => {
  const booking = await prisma.bookings.create({
    data: {
      ...req.body,
      bookingDate: new Date(),
    },
  });
  console.log(booking);
  res.status(200).json({
    status: "success",
    data: booking,
  });
});

const getAllBookings = catchAsync(async (req, res, next) => {
  const bookings = await prisma.bookings.findMany();
  console.log(bookings);
  res.status(200).json({
    status: "success",
    total: bookings.length,
    data: bookings,
  });
});
const getBookingsById = catchAsync(async (req, res, next) => {
  const booking = await prisma.bookings.findFirst({
    where: { bookingId: req.params.bookingId },
  });
  console.log(booking);
  res.status(200).json({
    status: "success",
    data: booking,
  });
});
const deleteBookingsById = catchAsync(async (req, res, next) => {
  const booking = await prisma.bookings.delete({
    where: { bookingId: req.params.bookingId },
  });
  console.log(booking);
  res.status(200).json({
    status: "success",
    data: booking,
  });
});

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
    next();
  } else {
    return res.status(200).json({
      status: "failed",
      message: "You're not logged in",
    });
  }
});

const router = express.Router();

router
  .route("/")
  .get(isLoggedIn, getAllBookings)
  .post(isLoggedIn, createBookings);
router
  .route("/:bookingId")
  .get(isLoggedIn, getBookingsById)
  .delete(isLoggedIn, deleteBookingsById);

app.use("/bookings", router);

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

app.listen(3003, () => {
  console.log("running booking service from the port 3003.........");
});


