const jwt = require('jsonwebtoken');
const UserSchema = require('../models/UserSchema');
const secretKey = 'ftsacserngawearb';
const authorizeRoles = ['admin'];

function generateToken(data) {
  console.log(data);
  const token = jwt.sign(data = { id: data._id }, secretKey);
  return token;
}

async function authenticate(req,res,next){
  try {
    const { token } = req.cookies;
    console.log(req.cookies);
    if (!token) {
      throw ({ message: 'Please login before access'});
    }
    const decodedData = jwt.verify(token, secretKey);
    const { id } = decodedData;
    const user = await UserSchema.findById(id);
    if (!user) {
      throw ({ message: 'Unable to identify ,please login again'});
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: 'Something Went Wrong',
      error,
    })
  }
}

function authorize(req,res,next) {
  try {
    const { user } = req;
    const { role } = user;
    if(authorizeRoles.find((element)=>element === role)) {
      return next();
    }
    return res.status(401).json({
      message: 'Your are not authorize to access to this feature',
      error: {
        message: 'Unauthoried'
      },
    })
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: 'Something Went Wrong',
      error,
    });
  }
}


module.exports = {
  authenticate,
  generateToken,
  authorize
}
