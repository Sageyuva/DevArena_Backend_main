const express = require("express"); 
const router = express.Router();
const{userLoginController ,userRegisterController , verifyEmailController} = require("../Controllers/UserController");

router.post("/register", userRegisterController);
router.post("/login",userLoginController)
router.get("/verify", verifyEmailController);



module.exports = router;