const express = require("express"); 
const router = express.Router();
const{newverifyEmailController ,userLoginController ,userRegisterController , verifyEmailController} = require("../Controllers/UserController");

router.post("/register", userRegisterController);
router.post("/login",userLoginController)
router.get("/verify", verifyEmailController);
router.post("/newVerify" , newverifyEmailController)



module.exports = router;