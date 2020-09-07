module.exports = function(app) {
    app.get("/", (req, res) => {
        res.redirect("/index.html");
    })
};


// module.exports = router;