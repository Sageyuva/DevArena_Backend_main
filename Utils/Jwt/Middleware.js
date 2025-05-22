const jwt = require('jsonwebtoken');

const verifyToken = async (req,res,next)=> {
    const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
    
  if(!token){
    return res.status(401).json({
        success:false,
        message:"not authorized"
    })
  }

  try {
    //console.log(token); 
    const decode = jwt.verify(token , process.env.JWT_SECRET);
    req.userId = decode.id;
    next();
  } catch (error) {
    return res.status(401).json({
        success:false,
        message:"not authorized"
    })
  }

}

module.exports = {verifyToken};