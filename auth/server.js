const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(express.json());

const JSON_SECRET = "microservice";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const catchAsync = (fn) => {
  return (req, res, next) => {
    // console.log(req)
    // console.log(req.method, req.originalUrl, req.body);
    fn(req, res, next).catch(next);
  };
};

const createUser = catchAsync(async (req, res, next) => {
  const user = await prisma.user.create({
    data: {
      ...req.body,
      password: bcrypt.hashSync(req.body.password, 10),
    },
  });
  console.log(user);
  res.status(200).json({
    status: "success",
    data: user,
  });
});

const loginUser = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const user = await prisma.user.findFirst({
    where: {
      email: req.body.email,
    },
  });
  console.log(user);
  if (!user) {
    console.log("/login........no user found");
    return res.status(404).json({
      status: "failed",
      message: "Email or password invalid",
    });
  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    console.log("/login........password not matched");
    return res.status(404).json({
      status: "failed",
      message: "Email or password invalid",
    });
  }

  let token = jwt.sign({ data: user }, JSON_SECRET, {
    expiresIn: "1h",
  });

  res.status(200).json({
    status: "success",
    token,
    user,
  });
});

const isLoggedInMiddleware = (req, res, next) => {
  if(!req.get("Authorization")){
    return res.status(200).json({
      status: "failed",
      message: "Invalid token",
    });
  }
  let token = req.get("Authorization").split(" ")[1];
  console.log("token ", token);
  jwt.verify(token, JSON_SECRET, (err, user) => {
    if (err) {
      return res.status(200).json({
        status: "failed",
        message: "Invalid token",
      });
    }

    req.user = user.data;

    next();
  });
};

const isLoggedIn = catchAsync(async(req, res, next) => {
  if(!req.get("Authorization")){
    return res.status(200).json({
      status: "failed",
    });
  }
  let token = req.get("Authorization").split(" ")[1];
  console.log("token ", token);
  jwt.verify(token, JSON_SECRET, (err, user) => {
    if (err) {
      return res.status(200).json({
        status: "failed",
      });
    }

    return res.status(200).json({
      status: "success",
      user:user.data
    });
  });
});

const getUser = catchAsync(async (req, res, next) => {
  console.log("get user", req.user);
  res.status(200).json({
    status: "message",
    data: req.user,
  });
});
const updateUser = catchAsync(async (req, res, next) => {
  const user = await prisma.user.update({
    where: {
      userId: req.user.userId,
    },
    data: {
      ...req.body,
      password: req.user.password,
    },
  });
  res.status(200).json({
    status: "success",
    data: user,
  });
});

const router = express.Router();
// POST / register;
// POST / login;
// GET / profile;
// PUT / profile;

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/isLoggedin", isLoggedIn);
router
  .route("/profile")
  .get(isLoggedInMiddleware, getUser)
  .put(isLoggedInMiddleware, updateUser);

app.use("/auth", router);

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

app.listen(3006, () => {
  console.log("auth server running from port 3006.........");
});
