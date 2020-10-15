const router = require("express").Router();
const userController = require("../../controllers/api-routes");
const stickyController = require("../../controllers/sticky-api-routes");

// require("../../controllers/api-routes.js")(app);
// require("../../controllers/sticky-api-routes.js")(app);

// Matches with "/api"
router.route("/api/login")
  .get(booksController.findAll)
  .post(booksController.create);

// Matches with "/api/books/:id"
router
  .route("/:id")
  .get(booksController.findById)
  .put(booksController.update)
  .delete(booksController.remove);

module.exports = router;
