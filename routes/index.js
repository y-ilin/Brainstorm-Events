// const router = require("express").Router();
// const apiRoutes = require("./api");

require("./controllers/api-routes.js")(app);
require("./controllers/sticky-api-routes.js")(app);

// // API Routes
// router.use("/api", apiRoutes);
// // require("../controllers/api-routes.js")(app);
// // require("../controllers/sticky-api-routes.js")(app);

// // If no API routes are hit, send the React app
// router.use(function(req, res) {
//   res.sendFile(path.join(__dirname, "../client/build/index.html"));
// });

module.exports = router;
