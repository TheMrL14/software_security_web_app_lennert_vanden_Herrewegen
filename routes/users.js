/* 
  /movies request
*/
const app = require("express");
const cors = require("cors");
var Auth = require("../connection/Auth");
const Dao = require("../dao/userDao");
const response = require("../model/Responses");

const router = app.Router();
const dao = new Dao();

//OPTIONS
router.options("/", (req, res, next) => res.sendStatus(200));

//POST
router.post("/", (req, res) => {
  let user = {
    userId: req.body.userId,
    userName: req.body.userName,
    email: req.body.email,
    isUser: 1,
    isAdmin: 0,
  };

  dao.addNewUser(user, (err, data, fields) => {
    if (err) throw err;
    res.location("/users/" + data.insertId);
    res.send(201, null);
  });
});

/*
/id
*/

//GET
router.get("/:id", (req, res) => {
  const id = req.params.id;
  if (id == undefined) {
    res.sendStatus(400);
    return;
  }
  dao.getUserById(req.params.id, (err, data, fields) => {
    if (err) throw err;
    if (data === undefined || data.length == 0) {
      res.sendStatus(404);
      return;
    }

    res.json(data);
  });
});

//PUT
router.put("/:id", (req, res) => {
  //check if Id in params
  const id = req.params.id;
  if (id == undefined || isNaN(id)) {
    res.sendStatus(404);
    return;
  }
  let user = {
    userId: req.body.userId,
    userName: req.body.userName,
    email: req.body.email,
    isUser: 1,
    isAdmin: 0,
  };
  // DELETE undefined objects from updated user
  Object.keys(user).forEach((key) =>
    user[key] === undefined ? delete user[key] : {}
  );
  //CHECK IF Object isn't empty after removing undefined options
  if (Object.keys(user).length === 0) {
    res.sendStatus(204);
    return;
  }

  dao.updateUser(user, id, (err, data, fields) => {
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
router.delete("/:id", (req, res) => {
  //check if Id in params
  const id = req.params.id;
  if (id == undefined || isNaN(id)) {
    res.sendStatus(404);
    return;
  }
  dao.deleteUser(req.params.id, (err, data) => {
    if (err) throw err;
    if (data.affectedRows == 0) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(200);
    return;
  });
});

//SEARCH REVIEWS BY USER ID

router.get("/reviews/:id", (req, res, next) => {
  const id = req.params.id;
  dao.getReviewsOfUser(id, (err, data, fields) => {
    if (err) throw err;
    res.json(data);
  });
});

//CHECK IF EXISTS
router.get("/count/:id", (req, res) => {
  const id = req.params.id;
  if (id == undefined) {
    res.sendStatus(404);
    return;
  }
  dao.checkIfUserExist(req.params.id, (err, data, fields) => {
    if (err) throw err;
    if (data === undefined || data.length == 0) {
      res.sendStatus(404);
      return;
    }
    res.json(data[0]);
  });
});

//DOWNLOAD USER DATA
router.get("/data/:id", (req, res) => {
  const id = req.params.id;
  if (id == undefined) {
    res.sendStatus(404);
    return;
  }
  dao.downloadUserData(req.params.id, (err, data) => {
    if (err) throw err;
    if (data === undefined || data.length == 0) {
      res.sendStatus(404);
      return;
    }

    var json = JSON.stringify(data);
    res.setHeader("Content-disposition", "attachment; filename= data.json");
    res.setHeader("Content-type", "application/json");
    res.write(json, function (err) {
      res.end();
    });
  });
});

//NOT ALLOWED
router.all("/", (req, res, next) => res.sendStatus(404));

module.exports = router;
