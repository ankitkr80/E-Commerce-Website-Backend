const UserSchema = require('./../../models/UserSchema');
const { ERROR_MESSAGES, SUCCESS_MESSAGES, ERROR_MESSAGES: { VALIDATION_MESSAGES }} = require('./user.constant');
const { generateToken } = require('../../authentication/auth');
const bcrypt = require('bcryptjs');

async function login(req,res) {
  try {
    const {
      userName, password 
    } = req.body;
    const user = await UserSchema.findOne({
      $or: [
        {
          email: userName
        },
        {
          mobile: userName
        }
      ]
    });
    if(!user) {
      throw ({ message: 'User not registered'});
    }
    console.log(password, user.password, bcrypt.compareSync(password, user.password));
    if (!bcrypt.compareSync(password, user.password)){
      throw({message: "password didn't matched"});
    }
    const token = generateToken(user);
    const options = {
      http: true,
      expiresIn: 7*24*60*60*1000 
    };
    return res.status(200).cookie('token', token, options).json({
      message: SUCCESS_MESSAGES.SUCCESSFULLY_REGISTERED,
      data: { user }
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: ERROR_MESSAGES.SOMETHING_WENT_WRONG,
      error,
    })
  }
}
async function logout(req,res) {
  try {
    return res.status(200).clearCookie('token').json({
      message: SUCCESS_MESSAGES.SUCCESSFULLY_REGISTERED,
      data: {}
    });
  } catch (error){
    return res.status(500).json({
      message: ERROR_MESSAGES.SOMETHING_WENT_WRONG,
      error,
    })
  }
}
async function getMyProfile(req,res) {
  try {
    const { user } = req;
    return res.status(200).json({
      data: { user }, 
      message: SUCCESS_MESSAGES.SUCCESSFULLY_FETCHED_PROFILE
    }) 
  } catch (error) {
    return res.status(500).json({
      message: ERROR_MESSAGES.SOMETHING_WENT_WRONG,
      error,
    })
  }
}
async function registerNewUser(req,res) {
  try {
    const {
      name, email, mobile, profilePic, password
    } = req.body;
    const users = await UserSchema.find({
      $or: [
        {
          email
        },
        {
          mobile
        }
      ]
    });
    // if(users && users.length) {
    //   throw ({ message: VALIDATION_MESSAGES.EMAIL_OR_MOBILE_EXISTS })
    // }
    console.log(name, email, mobile, profilePic, password);
    const user = new UserSchema({
      name, email, mobile, profilePic, password
    });
    await user.save();
    const token = generateToken(user);
    const options = {
      http: true,
      expiresIn: 7*24*60*60*1000 
    };
    return res.status(200).cookie('token', token, options).json({
      message: SUCCESS_MESSAGES.SUCCESSFULLY_REGISTERED,
      data: { user }
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: ERROR_MESSAGES.SOMETHING_WENT_WRONG,
      error,
    })
  }
}
async function UpdateMyProfile(req,res) {
  try {
    const {
      email,
      mobile,
      name,
      profilePic,
    } = req.body;
    const { user } = req;
    if(email) {
      const userCount = await UserSchema.count({
        email,
        _id: { $ne: user._id }
      })
      if(userCount){
        throw ({ message: 'Email already registered with other user'});
      }
    }
    if(mobile) {
      const userCount = await UserSchema.count({
        mobile,
        _id: { $ne: user._id }
      })
      if(userCount){
        throw ({ message: 'Mobile already registered with other user'});
      }
    }
    const updateQuery = {
      name,
      email,
      mobile,
      profilePic
    };
    await UserSchema.updateOne({_id: user._id},{$set: updateQuery });
    return res.status(201).json({
      message: SUCCESS_MESSAGES.SUCCESSFULLY_UPDATED_PROFILE,
      data: {}
    })
  } catch (error) {
    return res.status(500).json({
      message: ERROR_MESSAGES.SOMETHING_WENT_WRONG,
      error,
    })
  }
}
async function forgotPassword(req,res) {
  try {
    const { email, securityQuestion, securityAnswer } = req.body;
    const users = await UserSchema.find({
      email, securityQuestion
    });
    if (!users.length || users.length >1) {
      throw ({ message: 'user not found'});
    };
    const user = users[0];
    if(securityAnswer != user.securityAnswer){
      throw ({ message: 'user answer didnot matched' })
    }
    const token = generateToken(user);
    const options = {
      http: true,
      expiresIn: 7*24*60*60*1000 
    };
    return res.status(200).cookie('token', token, options).json({
      message: SUCCESS_MESSAGES.SUCCESSFULLY_REGISTERED,
      data: { user }
    })
  } catch (error) {
    return res.status(500).json({
      message: ERROR_MESSAGES.SOMETHING_WENT_WRONG,
      error,
    })
  }
}
async function updatePassword(req,res) {
  try {
    const { user } = req;
    const { password, email } = req.body;
    if(email != user.email){
      throw({ message: 'Invalid email'});
    }
    await UserSchema.updateOne({ _id: user._id }, { $set: password });
    return res.status(200).clearCookie('token').json({
      message: SUCCESS_MESSAGES.SUCCESSFULLY_REGISTERED,
      data: {}
    });
  } catch (error){
    return res.status(500).json({
      message: ERROR_MESSAGES.SOMETHING_WENT_WRONG,
      error,
    });
  }
}
async function getAllUser(req,res) {
  try {
    const users = await UserSchema.find();
    return res.status(200).json({
      data: { users },
      message: SUCCESS_MESSAGES.SUCCESSFULLY_FETCHED_ALL_USERS
    })
  } catch (error) {
    return res.status(500).json({
      message: ERROR_MESSAGES.SOMETHING_WENT_WRONG,
      error,
    })
  }
}
async function deleteUser(req,res) {
  try {
    const { id } = req.params;
    const user = await UserSchema.findById(id);
    if(!user) {
      throw ({ message: 'Invalid user Id'});
    }
    await UserSchema.deleteOne({ _id: id });
    return res.status(202).json({
       message: 'Successfully delete user'
    })
  } catch(error) {
    return res.status(500).json({
      message: ERROR_MESSAGES.SOMETHING_WENT_WRONG,
      error,
    })
  }
}

module.exports = {
  login,
  logout,
  getMyProfile,
  registerNewUser,
  UpdateMyProfile,
  forgotPassword,
  updatePassword,
  getAllUser,
  deleteUser
}
