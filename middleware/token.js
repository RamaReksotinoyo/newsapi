const e = require("express");
const jwt = require("jsonwebtoken");
const { BaseResponse } = require('../response/responses');

const rahasia = "ini_adalah_rahasia";


CreateToken = (payload) => {
  return jwt.sign(payload, rahasia, {expiresIn: '10m'});
};

ParseToken = (token) => {
  return jwt.verify(token, rahasia);
};

VerifyToken = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json(BaseResponse(null, 401, 'Unauthorized, token is missing'));
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json(BaseResponse(null, 401, 'Unauthorized, token is missing'));
    }
    req.user = ParseToken(token);
    if (req.user.isAdmin){
      next();
    } else {
      return res.status(403).json(BaseResponse(null, 403, 'Forbidden: Only admin can access this site'));
    }
  } catch (err) {
    return res.status(401).json(BaseResponse(null, 401, 'Invalid Token'));
  }
};


module.exports = { CreateToken, ParseToken, VerifyToken };