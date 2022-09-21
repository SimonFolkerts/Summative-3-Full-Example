const jwt = require("jsonwebtoken");

// auth middleware
// this is the middleware that we can attach to routes to enforce the presence of a valid token to access them. I.e. the user must be logged in to access the route.
const routeProtector = (req, res, next) => {
  const token = req.cookies.jwt; // get cookie from the request
  if (token) {
    // if cookie, try to verify it using the secret string
    jwt.verify(token, "asdflkasjdf", (error, decodedToken) => {
      if (error) {
        // if the token is not valid, the callback logs the error and sends it to the client
        console.log(error.message);
        res.json(error);
      } else {
        // otherwise, if valid, the decoded token is logged, and the middleware executes next() which allows the request to continue to the endpoint
        req.token = decodedToken;
        next();
      }
    });
  } else {
    res.json({ message: "unauthorised" });
  }
};

module.exports = routeProtector;
