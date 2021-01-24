const path = require("path");
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");
const nJwt = require("njwt");

module.exports = Object.freeze({
  checkJwt: jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: "https://appframework-dev.eu.auth0.com/.well-known/jwks.json",
    }),
    audience: "https://bmc.lennertvh.xyz",
    issuer: "https://appframework-dev.eu.auth0.com/",
    algorithms: ["RS256"],
  }),

  checkAPIjwt: (key) => {
    try {
      verifiedJwt = nJwt.verify(key, process.env.SIGNINGKEY);
      return 1;
    } catch (e) {
      return 0;
    }
  },
});
