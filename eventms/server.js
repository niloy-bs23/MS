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

const createEvent = catchAsync(async (req, res, next) => {
  const event = await prisma.events.create({
    data: {
      ...req.body,
      date: new Date(),
    },
  });
  console.log(event);
  res.status(200).json({
    status: "success",
    data: event,
  });
});
const getAllEvents = catchAsync(async (req, res, next) => {
  const events = await prisma.events.findMany();
  console.log(events);
  res.status(200).json({
    status: "success",
    total: events.length,
    data: events,
  });
});
const getEventByEventId = catchAsync(async (req, res, next) => {
  const event = await prisma.events.findFirst({
    where: {
      eventId: req.params.eventId,
    },
  });
  console.log(event);
  res.status(200).json({
    status: "success",
    data: event,
  });
});
const updateEventByEventId = catchAsync(async (req, res, next) => {
  const event = await prisma.events.update({
    where: {
      eventId: req.params.eventId,
    },
    data: {
      ...req.body,
    },
  });
  console.log(event);
  res.status(200).json({
    status: "success",
    data: event,
  });
});
const deleteEventByEventId = catchAsync(async (req, res, next) => {
  const event = await prisma.events.delete({
    where: {
      eventId: req.params.eventId,
    },
  });
  console.log(event);
  res.status(200).json({
    status: "success",
    data: event,
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

router.route("/").get(getAllEvents).post(isLoggedIn, createEvent);
router
  .route("/:eventId")
  .get(isLoggedIn, getEventByEventId)
  .put(isLoggedIn, updateEventByEventId)
  .delete(isLoggedIn, deleteEventByEventId);

app.use("/events", router);

app.use("*", async (req, res) => {
  res.status(200).json({
    status: "falied",
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

app.listen(3005, () => {
  console.log("running event service from the port 3005.........");
});
