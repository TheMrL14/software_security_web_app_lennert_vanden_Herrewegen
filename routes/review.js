/* 
  /reviews request
*/
const app = require("express");
const cors = require("cors");
var Auth = require("../connection/Auth");
const Dao = require("../dao/reviewDao");
const userDao = require("../dao/userDao");
const response = require("../model/Responses");

const router = app.Router();
const dao = new Dao();
const uDao = new userDao();

//OPTIONS
router.options("/", (req, res, next) => res.sendStatus(200));

//GET
router.get("/", (req, res, next) => {
  dao.getAllReviews((err, data, fields) => {
    if (err) throw err;
    res.json(data);
  });
});

//POST
router.post("/", Auth.checkJwt, (req, res) => {
  let review = {
    title: req.body.title,
    review: req.body.review,
    score: req.body.score,
    userId: req.body.userId,
  };
  let isAdmin = false,
    isUser = false;

  const promiseIsUser = new Promise((isUser, error) => {
    uDao.isUserNotAdmin(review.userId, (b) => {
      isUser(b);
    });
  });

  promiseIsUser.then((isUser) => {
    if (!isUser) {
      res.sendStatus(401);
      return;
    }
    dao.addNewReview(review, (err, data, fields) => {
      if (err) throw err;
      res.location("/reviews/" + data.insertId);
      res.sendStatus(201);
    });
  });
});

/*
/id
*/

router.use("/:id", (req, res, next) => {
  const id = req.params.id;
  if (id == undefined || isNaN(id)) {
    res.sendStatus(404);
    return;
  } else {
    next();
  }
});

//GET
router.get("/:id", (req, res) => {
  //check if Id in params
  const id = req.params.id;
  dao.getReviewById(req.params.id, (err, data, fields) => {
    if (err) throw err;
    if (data === undefined || data.length == 0) {
      res.sendStatus(404);
      return;
    }

    res.json(data);
  });
});

//PUT
router.put("/:id", Auth.checkJwt, (req, res) => {
  let review = {
    title: req.body.title,
    review: req.body.review,
    score: req.body.score,
  };

  // DELETE undefined objects from updated review
  Object.keys(review).forEach((key) =>
    review[key] === undefined ? delete review[key] : {}
  );
  //CHECK IF Object isn't empty after removing undefined options
  if (Object.keys(review).length === 0) {
    res.sendStatus(204);
    return;
  }

  dao.updateReview(review, id, (err, data, fields) => {
    if (err) throw err;
    if (data.affectedRows == 0) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(200);
    return;
  });
});
//DELETE
router.delete("/:id", Auth.checkJwt, (req, res) => {
  dao.deletereview(req.params.id, (err, data) => {
    if (err) throw err;
    if (data.affectedRows == 0) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(200);
    return;
  });
});

//NOT ALLOWED
router.all("/", (req, res, next) => res.sendStatus(404));

module.exports = router;

let checkIfIdInParam = () => {};
