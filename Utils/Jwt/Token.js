const jwt = require('jsonwebtoken');

const generateToken = (id , user , mail) => {
  return jwt.sign(
    { id  , user , mail }, // payload
    process.env.JWT_SECRET, // secret
    { expiresIn: '3d' } // expires in 3 days
  );
};

module.exports = generateToken;
