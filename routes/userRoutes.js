import { Router } from 'express';
var router = Router();
import {
  sendOtp,
  confirmOtp,
  createUser,
  login,
  forgetPassword,
  verifyOTP,
  resetPassword,
  getRoles,
} from '../controllers/userController.js';
import jwt from 'jsonwebtoken';
const verify = jwt.verify;
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  console.log(token);
  if (!token) {
    res.send('We need a token');
  } else {
    verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log('you failed authenticate');
        res.json({ auth: false, message: 'you failed authenticate' });
      } else {
        req.userId = decoded.id;
        console.log('you authenticated');
        next();
      }
    });
  }
};

//Route for sending registration OTP
router.post('/sendotp', sendOtp);
//Route for verifying registration OTP
router.post('/confirmotp', confirmOtp);
//Route for registering after verification
router.post('/', createUser);
//Route for registering after verification
router.post('/login', login);
//Route for getting forget password otp on email
router.post('/forgetpassword', forgetPassword);
//Route for verifying forget password otp
router.post('/verifyotp', verifyOTP);
//Route for getting forget password otp on email
router.post('/resetpassword', resetPassword);
//Route for getting roles
router.get('/roles', getRoles);
export default router;
