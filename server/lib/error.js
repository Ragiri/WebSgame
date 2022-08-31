const errors = [
  { code: 400, text: "Bad request" },
  { code: 401, text: "Unauthorized" },
  { code: 403, text: "Forbidden" },
  { code: 500, text: "Internal server error" },
  { code: 501, text: "Not implemented" },
];

const errorManager = (err, req, res, next) => {
  console.log("error");
  res.status(400).send("Error");
};

module.exports = errorManager;

const isNotNull = (object) => {
  if (object !== undefined && object !== null && object !== "undefined") {
    return true;
  }
  return false;
};

const isStringNotNull = (string) => {
  if (isNotNull(string) && string.length && typeof string === "string") {
    return true;
  }
  return false;
};

const error = new Object();

error.handleError = (err, req, res, next) => {
  let statusCode = res.respStatus || err.statusCode || 500;
  res.status(statusCode);

  let errorMsg = res.errorMsg || err.errorMsg;
  if (!isStringNotNull(errorMsg)) {
    switch (statusCode) {
      case 400:
        errorMsg = "Missing inputs for this endpoint";
        break;
      case 410:
        errorMsg = "Activity not available";
        break;

      default:
        errorMsg = "Internal server error";
    }
  }

  res.json({
    status: statusCode,
    error: true,
    errorMsg,
  });

  console.log(err);
};
module.exports = error;
