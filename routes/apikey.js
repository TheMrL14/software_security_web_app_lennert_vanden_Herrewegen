/* 
  /movies request
*/
const app = require("express");
const cors = require("cors");
const uuid = require("uuid");
const nJwt = require("njwt");

const Auth = require("../connection/Auth");
const Dao = require("../dao/reviewDao");
const userDao = require("../dao/userDao");
const response = require("../model/Responses");

const router = app.Router();
const dao = new Dao();
const uDao = new userDao();

//OPTIONS
router.options("/", (req, res, next) => res.sendStatus(200, null));

const publicCorsOpitions = {
  origin: ["*"],
  methods: "GET",
  allowedHeaders: "",
};

//GET
router.get("/", cors(publicCorsOpitions), (req, res, next) => {
  const signingKey = process.env.SIGNINGKEY;
  const claims = {
    iss: "http://bmc.lennertvh.xyz/", // The URL of your service
    scope: "user",
    exp: new Date().getFullYear() + 1,
  };
  const jwt = nJwt.create(claims, signingKey);

  const token = jwt.compact();
  console.log(Auth.checkAPIjwt(token));
  console.log(Auth.checkAPIjwt("abcdef"));
});

router.get("/reviews", (req, res, next) => {
  const key = req.query.apikey;
  if (Auth.checkAPIjwt(key) !== 1) {
    res.sendStatus(401);
    return;
  }
  next();
});

router.get("/reviews/:id", (req, res, next) => {
  const key = req.query.apikey;

  if (Auth.checkAPIjwt(key) !== 1) {
    res.sendStatus(401);
    return;
  }
  next();
});

//GET
router.get("/reviews", cors(publicCorsOpitions), (req, res, next) => {
  dao.getAllReviews((err, data, fields) => {
    if (err) throw err;
    res.json(data);
  });
});
//GET
router.get("/reviews/:id", cors(publicCorsOpitions), (req, res, next) => {
  const id = req.params.id;
  dao.getReviewById(id, (err, data, fields) => {
    if (err) throw err;
    res.json(data);
  });
});

//NOT ALLOWED
router.all("/", (req, res, next) => res.sendStatus(404));

module.exports = router;

let checkIfIdInParam = () => {};
