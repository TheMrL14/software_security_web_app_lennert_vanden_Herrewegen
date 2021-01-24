var DB = require("../connection/db");
const dbPath = "ebdb.User";
const dbReviewPath = "ebdb.Review";
module.exports = class userDao {
  constructor() {
    this.db = new DB().getInstance();
  }
  getAllUsers = (callback) => {
    const sql = "SELECT * FROM " + dbPath + ";";
    this.db.executeQuery(sql, callback);
  };

  getUserById = (id, callback) => {
    const sql = "SELECT * FROM " + dbPath + " WHERE userId = ?";
    this.db.executeQueryWithParams(sql, id, callback);
  };

  checkIfUserExist = (id, callback) => {
    const sql = "SELECT COUNT(*) AS count FROM " + dbPath + " WHERE userId = ?";
    this.db.executeQueryWithParams(sql, id, callback);
  };

  downloadUserData = (id, callback) => {
    let user = {
      email: null,
      reviews: [],
    };

    const sql = "SELECT * FROM " + dbPath + " WHERE userId = ?";
    this.db.executeQueryWithParams(sql, id, (err, data) => {
      user.email = data[0].email;
      const sql = "SELECT title,review FROM ebdb.Review WHERE userId = ?";
      this.db.executeQueryWithParams(sql, id, (err, data2) => {
        user.reviews = data2;

        callback(err, user);
      });
    });
    //
  };

  getReviewsOfUser = (id, callback) => {
    const sql = "SELECT * FROM " + dbReviewPath + " WHERE userId = ?";
    this.db.executeQueryWithParams(sql, id, callback);
  };

  addNewUser = (user, callback) => {
    let newUser = {
      userId: user.userId,
      userName: user.userName,
      email: user.email,
      isUser: 0,
      isAdmin: 0,
    };
    const sql = "INSERT INTO " + dbPath + " SET ?";
    this.db.executePostQuery(sql, newUser, callback);
  };

  updateUser = (user, id, callback) => {
    const sql =
      "UPDATE " +
      dbPath +
      " SET " +
      Object.keys(user)
        .map((key) => `${key} = ?`)
        .join(", ") +
      " WHERE userId = ?";

    const post = [...Object.values(user), id];
    this.db.executePostQuery(sql, post, callback);
  };

  deleteUser = (id, callback) => {
    const sql = "DELETE FROM " + dbPath + " WHERE userId = ? ";
    this.db.executeQueryWithParams(sql, id, callback);
  };

  isUserNotAdmin = (id, callback) => {
    const sql = "SELECT isUser,isAdmin FROM ebdb.User where userId = ?";
    this.db.executeQueryWithParams(sql, id, (err, data) => {
      if (data == undefined) {
        callback(0);
        return;
      }
      if (data[0].isUser === 1) {
        callback(true);
        return;
      } else if (data[0].isAdmin === 1) {
        callback(false);
        return;
      }
      callback(null);
      return;
    });
  };
};
