var DB = require("../connection/db");
const dbPath = "ebdb.Review";
module.exports = class MovieDao {
  constructor() {
    this.db = new DB().getInstance();
  }
  getAllReviews = (callback) => {
    const sql = "SELECT * FROM " + dbPath + ";";
    this.db.executeQuery(sql, callback);
  };

  getReviewById = (id, callback) => {
    const sql = "SELECT * FROM " + dbPath + " WHERE id = ?";
    this.db.executeQueryWithParams(sql, id, callback);
  };

  addNewReview = (review, callback) => {
    const post = {
      title: review.title,
      review: review.review,
      score: review.score,
      userId: review.userId,
    };
    const sql = "INSERT INTO " + dbPath + " SET ?";
    this.db.executePostQuery(sql, post, callback);
  };

  updateReview = (review, id, callback) => {
    const sql =
      "UPDATE " +
      dbPath +
      " SET " +
      Object.keys(review)
        .map((key) => `${key} = ?`)
        .join(", ") +
      " WHERE id = ?";

    const post = [...Object.values(review), id];
    this.db.executePostQuery(sql, post, callback);
  };

  deleteMovie = (id, callback) => {
    const sql = "DELETE FROM " + dbPath + " WHERE id = ?";
    this.db.executeQueryWithParams(sql, id, callback);
  };
};
