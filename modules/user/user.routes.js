const express = require('express');
const router = express.Router();
const { login, logout, getAllUser, getMyProfile, updatePassword, registerNewUser, deleteUser, forgotPassword, UpdateMyProfile} = require('./user.controller');
const { authenticate, authorize } = require('../../authentication/auth');

router.route('/login').post(login);
router.route('/logout').put(logout);
router.route('/').get(authenticate, getMyProfile).post(registerNewUser).put(authenticate, UpdateMyProfile);
router.route('/admin/').get(authenticate, authorize, getAllUser);
router.route('/admin/:id').delete(authenticate, authorize, deleteUser);
router.route('/forgotPassword').put(forgotPassword)
router.route('/resetPassword').put(authenticate, updatePassword);

module.exports = router;
