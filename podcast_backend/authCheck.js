const jwt = require("jsonwebtoken")
module.exports = function(req, res, next) {
  try{
    const token = req.headers.authorization.split(" ")[1];
    console.log(req.headers.authorization)
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
  	 console.log(req.headers.authorization)
    return res.status(401).json({ isAuthenticated: false})
  }
}