// module.exports = function(app) {
//     app.get("/", (req, res) => {
//         console.log('yeyuh')
//         res.redirect("/index");
//     })

//     app.get("/signup", (req, res) => {
//         // If the user already has an account send them to the whiteboard page
//         if (req.user) {
//         res.redirect("/index");
//         }
//         sendFile(path.join(__dirname + '/signup.html'));
//         // res.redirect("/signup");
//     });

//     app.get("/login", (req, res) => {
//         // If the user already has an account send them to the whiteboard page
//         if (req.user) {
//         res.redirect("/index");
//         }
//         sendFile(path.join(__dirname + '/login.html'));
//         // res.redirect("/login");
//     });
// };


// // module.exports = router;