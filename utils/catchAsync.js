module.exports = (myFn) => {
  return (req, res, next) => {
    myFn(req, res, next).catch(next);
  };
};
