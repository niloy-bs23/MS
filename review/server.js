const express = require("express");
const app = express();
const redis=require("redis")
const client = require('prom-client');
const register = new client.Registry();
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

// Create a counter metric
const counter = new client.Counter({
  name: 'node_request_count',
  help: 'The total number of requests',
  registers: [register],
});

// Create a histogram metric
const histogram = new client.Histogram({
  name: 'node_request_duration_seconds',
  help: 'Histogram of the duration of HTTP requests in seconds',
  buckets: [0.1, 0.5, 1, 1.5],
  registers: [register],
});

// Middleware to count requests and measure duration
app.use((req, res, next) => {
  const end = histogram.startTimer();
  counter.inc();
  res.on('finish', () => {
    end();
  });
  next();
});

// Create a Redis client
const redisClient = redis.createClient({
  host: "localhost",
  port: 6379,
});

redisClient.on("error", (err) => {
  console.error("Redis client error:", err);
});

(async () => {
  await redisClient.connect();
})();

// Promisify Redis get and set methods for async/await usage
// const getAsync = promisify(client.get).bind(client);
// const setAsync = promisify(client.set).bind(client);

const getAlReviewsByEventId = catchAsync(async (req, res, next) => {
  // await client.connect();
  const cacheKey = `${req.params.eventId}`;
  console.log(cacheKey);
  // Check if data is in cache
  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) {
    console.log("Fetching data from cache");
    return res.status(200).json({
      status: "success",
      source: "Cache",
      data: JSON.parse(cachedData),
    });
  }

  // If not, fetch data from database
  const reviews = await prisma.reviews.findMany({
    where: { eventId: cacheKey },
  });
  console.log(reviews);
  // Store the fetched data in cache
  await redisClient.set(cacheKey, JSON.stringify(reviews), "EX", 3600);
  console.log("Fetching data from database and storing in cache");

  return res.status(200).json({
    status: "success",
    source: "DB",
    data: reviews,
  });
});

const createReviews = catchAsync(async (req, res, next) => {
  const data = req.body;
  const review = await prisma.reviews.create({
    data: {
      ...req.body,
      date: new Date(),
    },
  });
  console.log(review);
  res.status(200).json({
    status: "success",
    data: review,
  });
});

const getAllReviewsByUserId = catchAsync(async (req, res, next) => {
  const reviews = await prisma.reviews.findMany({
    where: { userId: req.params.userId },
  });
  console.log(reviews);

  res.status(200).json({
    status: "success",
    data: reviews,
  });
});

const router = express.Router();

router.post("/", createReviews);
router.get("/:eventId", getAlReviewsByEventId);
router.get("/user/:userId", getAllReviewsByUserId);

app.use("/reviews/", router);

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

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

app.listen(3001, () => {
  console.log("running review service from the port 3001.........");
});
