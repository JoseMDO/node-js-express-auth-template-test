const router = require("express").Router()
const path = require('path')
const passport = require("passport")

// YOUR CUSTOM URL GOES HERE 
const CLIENT_URL = "https://node-js-express-auth-template.azurewebsites.net/"

router.get("/login/failed", (req,res) => {
    res.status(401).json({
        success: false, 
        message: "Failed to log in"
    })
})

router.get("/login/success", (req,res) => {
    if (req.user) {
        console.log("user: " + req.user)
        res.status(200).json({
            success: true,
            message: "Log in Successful",
            user: req.user,
        })
    } else {
        console.log("req.user:", req.user)
    }
})

router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect(CLIENT_URL);
    });
});

router.get("/login", (req, res) => {
	if (req.user) {
		res.redirect("/dashboard.html")
		return
	}
    const filePath = path.join(__dirname, '../client', "/index.html"); 
    res.sendFile(filePath);
})

const isAuth = (req, res, next) => {
	if (req.isAuthenticated()) {
	  next();
	} else {
        console.log('not logged in ')
	  res.redirect('/login');
	}
  };

router.get("/index.html", isAuth, (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("/dashboard.html")
    } else {
        res.redirect('/')
    }
})


router.get("/", isAuth, (req, res) => {
    const filePath = path.join(__dirname, '../client', "/dashboard.html"); 
    res.sendFile(filePath);
})

const protectedRoutes = ["/dashboard.html"];

protectedRoutes.forEach(route => {
    router.get(route, isAuth, (req, res) => {
      // Use path.join to construct the correct file path
      const filePath = path.join(__dirname, '../client', route);
      res.sendFile(filePath);
    });
  });



router.get("/auth/google", passport.authenticate("google", 
    { 
        scope: ["profile"],
        'session': true
    }));

router.get("/auth/google/callback",passport.authenticate("google", {
    successRedirect: "/dashboard.html",
    failureRedirect: "/login/failed",
  })
);

router.get("/auth/github", passport.authenticate("github", 
    { 
        scope: ["profile"],
        'session': true
    }));

router.get("/auth/github/callback",passport.authenticate("github", {
    successRedirect: "/dashboard.html",
    failureRedirect: "/login/failed",
  })
);
module.exports = router