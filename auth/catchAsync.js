module.exports = (fn) => {
  return (req, res, next) => {
    // console.log(req)
    // console.log(req.method, req.originalUrl, req.body);
    fn(req, res, next).catch(next);
  };
};
