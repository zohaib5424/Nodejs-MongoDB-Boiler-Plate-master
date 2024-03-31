import userModel from '../models/userModel.js';
import superAdminUserModel from '../models/superAdminUserModel.js';
import superAdminEditorModel from '../models/superAdminEditorModel.js';
import companyAdminModel from '../models/companyAdminModel.js';
import companyEditorModel from '../models/companyEditorModel.js';
import managerModel from '../models/managerModel.js';
import viewerModel from '../models/viewerModel.js';

import {
  valide,
  superAdminUserValidateSchema,
  createUserValidateSchema,
  loginValidateSchema,
  superAdminEditorValidateSchema,
  companyAdminValidateSchema,
  companyEditorValidateSchema,
  managerValidateSchema,
  viewerValidateSchema,
} from './validation/validation.js';
import bcrypt from 'bcryptjs';
import otpGenerator from 'otp-generator';

import { ObjectID as ObjectId } from 'mongodb';
const saltRounds = 10;
import jwt from 'jsonwebtoken';

import { generate } from 'otp-generator';
import nodemailer from 'nodemailer';
import { sendEmail } from '../helpers/sendEmail.js';
import { sendMessage } from '../helpers/sendMessage.js';
import otpModel from '../models/otpModel.js';
// import { find } from '../models/Role.js';
// var accountSid = process.env.TWILIO_ACCOUNT_SID;
// var authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require("twilio")(accountSid, authToken);
const sign = jwt.sign;
export const sendOtp = async (req, res) => {
  try {
    const { email, phoneno } = req.body;
    //Creating OTP for SMS
    var otp = generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    console.log('otp : ', otp);

    if (email) {
      const user = await findOne({ email });
      if (user) {
        // Send OTP to email
        const emailSent = await sendEmail(
          req.body.email,
          'OTP for registration',
          `Add This OTP ${otp} to register`
        );
        if (!emailSent) {
          return res.status(404).json({
            success: false,
            message: 'Email Not Valid',
          });
        }
        // Insert into otpModel
        // const otpEntry = new otpModel({
        //   otp: otp,
        //   email: email,
        // });
        // await otpEntry.save();
        user.otp = otp;
        await user.save();
      } else {
        return res.status(404).json({
          success: false,
          message: 'User Not Valid',
        });
      }
    }

    if (phoneno) {
      const user = await findOne({ email });
      if (user) {
        console.log('length', req.body.phoneno.toString().length);
        var length = req.body.phoneno.toString().length;
        if (length < 6 || length > 12) {
          return res.status(422).json({
            success: false,
            message: 'Number digits should be 6-12',
          });
        }
        // Sending OTP to upcoming user number for register verification
        const messageSent = await sendMessage(
          phoneno,
          `Add This OTP ${otp} to register`
        );
        if (!messageSent) {
          return res.status(404).json({
            success: false,
            message: 'Number Not Valid',
          });
        }
        // Insert into otpModel
        // const otpEntry = new otpModel({
        //   otp: otp,
        //   phoneno: phoneno,
        // });
        // await otpEntry.save();
        user.otp = otp;
        await user.save();
      } else {
        return res.status(404).json({
          success: false,
          message: 'User Not Valid',
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'OTP has been sent.',
    });
  } catch (err) {
    console.log(err);
    if (err.isJoi) {
      return res.status(422).json({
        success: false,
        message: err.details[0].message,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
};

export const confirmOtp = async (req, res) => {
  try {
    console.log(req.body.otp);
    //Finding number with given otp
    // otpModel.findOne({ otp: req.body.otp }).then(async otpProfile => {

    // userModel
    //   .findOneAndUpdate(
    //     { 'otpVerification.otp': req.body.otp }, // Find the user by their OTP
    //     { 'otpVerification.isVerified': true }, // Update the isVerified field to true
    //     { new: true } // Return the updated document
    //   )
    findOne({ otp: req.body.otp }).then(async otpProfile => {
      console.log('user', otpProfile);
      const updatedOtp = await updateOne(
        { otp: req.body.otp },
        {
          $set: {
            otp: null,
          },
        }
      );
      //Find if any otp exists
      if (otpProfile) {
        res.status(200).send({
          success: true,
          user: otpProfile,
          message: 'OTP Successful, User Can Register',
        });
      } else {
        //send fail response if otp doesn't exists

        res.status(404).send({
          success: false,
          message: 'Invalid Otp',
        });
      }
    });
  } catch (err) {
    console.log(err);
    if (err.isJoi) {
      res.status(422).json({
        success: false,
        message: err.details[0].message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
};

export const createUser = async (req, res) => {
  console.log('createUser api');
  let { err, value } = await valide(req, createUserValidateSchema);
  console.log('value: ', value);
  if (value.role != 'superAdminUser' && value.password == 'nopassword') {
    // Creating password for login
    const autoPassword = otpGenerator.generate(8, {
      digits: true,
      upperCaseAlphabets: true,
      specialChars: true,
      lowerCaseAlphabets: true,
    });
    req.body.password = autoPassword;
  }
  if (err) {
    return res.status(400).json({ message: 'Invalid parameters', err });
  }
  let valueNew;
  if (value.role == 'superAdminUser') {
    const { err, value } = await valide(req, superAdminUserValidateSchema);
    valueNew = value;
    if (err) {
      return res.status(400).json({ message: 'Invalid parameters', err });
    }
  } else if (value.role == 'superAdminEditor') {
    const { err, value } = await valide(req, superAdminEditorValidateSchema);
    valueNew = value;
    if (err) {
      return res.status(400).json({ message: 'Invalid parameters', err });
    }
  } else if (value.role == 'companyAdmin') {
    const { err, value } = await valide(req, companyAdminValidateSchema);
    valueNew = value;
    if (err) {
      return res.status(400).json({ message: 'Invalid parameters', err });
    }
  } else if (value.role == 'companyEditor') {
    const { err, value } = await valide(req, companyEditorValidateSchema);
    valueNew = value;
    if (err) {
      return res.status(400).json({ message: 'Invalid parameters', err });
    }
  } else if (value.role == 'manager') {
    const { err, value } = await valide(req, managerValidateSchema);
    valueNew = value;
    if (err) {
      return res.status(400).json({ message: 'Invalid parameters', err });
    }
  } else if (value.role == 'viewer') {
    const { err, value } = await valide(req, viewerValidateSchema);
    valueNew = value;
    if (err) {
      return res.status(400).json({ message: 'Invalid parameters', err });
    }
  }
  try {
    const ifuser = await userModel.findOne({
      email: valueNew.email.toLowerCase(),
    });
    if (ifuser) {
      return res.status(200).send({
        success: false,
        message: 'User Already Exists.',
      });
    }

    //encrypting user password
    const password = valueNew.password; // use for sending in email
    valueNew.password = await bcrypt.hash(valueNew.password, saltRounds);
    valueNew.email = valueNew.email.toLowerCase();
    let result;
    if (value.role == 'superAdminUser') {
      result = await superAdminUserModel.create(valueNew);
    } else if (req.body.role == 'superAdminEditor') {
      result = await superAdminEditorModel.create(valueNew);
    } else if (req.body.role == 'companyAdmin') {
      result = await companyAdminModel.create(valueNew);
    } else if (req.body.role == 'companyEditor') {
      result = await companyEditorModel.create(valueNew);
    } else if (req.body.role == 'manager') {
      result = await managerModel.create(valueNew);
    } else if (req.body.role == 'viewer') {
      result = await viewerModel.create(valueNew);
    }
    if (result) {
      const newUser = await new userModel({
        email: valueNew.email,
        role: req.body.role,
      }).save();
      const emailSent = await sendEmail(
        result.email,
        'Login Detail',
        `Your login email is ${result.email} and password is ${password} `
      );
      res.status(200).send({
        success: true,
        message: 'You are now user',
        data: result,
      });
    } else {
      console.log('Request Failed');
      res.status(404).send({
        success: false,
        message: 'Request Failed',
      });
    }
  } catch (err) {
    console.log('err.isJoi: ', err);
    if (err.isJoi) {
      res.status(422).json({
        success: false,
        message: err.details[0].message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: err,
      });
    }
  }
};
export const login = async (req, res) => {
  const { err, value } = await valide(req, loginValidateSchema);
  if (err) {
    return res.status(400).json({ message: 'Invalid parameters', err });
  }
  try {
    let { email, password } = value;
    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (user) {
      if (user.isDeleted == true) {
        return res.send(400).json({
          success: false,
          message: 'User not exists',
        });
      }

      const userDetail = await userModel.aggregate([
        {
          $match: { email },
        },
        {
          $lookup: {
            from: `${user.role.toLowerCase()}s`,
            localField: 'email',
            foreignField: 'email',
            as: 'userDetail',
          },
        },
        {
          $unwind: '$userDetail',
        },

        {
          $project: {
            _id: 0,
            userDetail: 1,
          },
        },
        {
          $replaceRoot: {
            newRoot: '$userDetail', // Replace the root with the contents of the userDetail array
          },
        },
      ]);
      if (await bcrypt.compare(password, userDetail[0].password)) {
        const accessToken = await sign(
          { id: user._id },
          process.env.JWT_SECRET,
          {
            expiresIn: '2d',
          }
        );
        userDetail[0].role = user.role;
        return res.status(200).json({
          success: true,
          message: 'Correct Details',
          user: userDetail[0],
          accessToken: accessToken,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Error: Email and Pass Dont Match',
        });
      }
    } else {
      console.log('Invalid User');
      return res.status(400).json({
        success: false,
        message: 'User not exists or User is not Verified',
      });
    }
  } catch (err) {
    console.log('err.isJoi: ', err);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
export const forgetPassword = async (req, res) => {
  try {
    console.log('U are ', req.body);
    const { email, phoneno } = req.body;
    if (email) {
      findOne({
        email: req.body.email,
      })
        .then(async user => {
          console.log('user', user);
          //Checking If User Exists
          if (!user) {
            return res.status(404).json({
              success: false,
              message: 'User not found with this Email!',
            });
          }
          //Creating Reset OTP for SMS
          var otp = generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
          });

          //Sending Reset OTP to email
          const emailSent = await sendEmail(
            req.body.email,
            'Reset Password',
            `Reset Password OTP: ${otp}`
          );

          if (!emailSent) {
            return console.log('error occurs');
          }

          user.resetPasswordOtp = otp;
          return user.save();
        })
        .then(result => {
          return res.status(200).send({
            success: true,
            message: 'Reset Password Email sent',
          });
        })
        .catch(err => {
          console.log(err);
        });
    } else if (phoneno) {
      findOne({
        phoneno: req.body.phoneno,
      })
        .then(async user => {
          console.log('user', user);
          //Checking If User Exists
          if (!user) {
            return res.status(404).json({
              success: false,
              message: 'User not found with this Email!',
            });
          }
          //Creating Reset OTP for SMS
          var otp = generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
          });

          const number = req.body.phoneno;
          console.log('numberrr: ', number);

          //Sending Reset OTP to phone
          const messageSent = await sendMessage(
            number,
            `Reset Password OTP: ${otp}`
          );

          if (!messageSent) {
            return console.log('error occurs');
          }

          user.resetPasswordOtp = otp;
          return user.save();
        })
        .then(result => {
          return res.status(200).send({
            success: true,
            message: 'Reset Password message sent',
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  } catch (err) {
    console.log('err.isJoi: ', err);
    if (err.isJoi) {
      res.status(422).json({
        success: false,
        message: err.details[0].message,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
};
export const verifyOTP = async (req, res) => {
  try {
    console.log('U are ', req.body);
    //Finding user with the reset OTP
    findOne({ resetPasswordOtp: req.body.resetPasswordOtp }).then(user => {
      //If User don't exist with the given resetOTP, give error
      console.log('user ', user);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Invalid OTP',
        });
      } else {
        //If User exists with the given resetOTP then send success
        return res.status(200).json({
          success: true,
          email: user.email,
          message: 'OTP Verified. User Can Change The Password',
        });
      }
    });
  } catch (err) {
    console.log(err);
    if (err.isJoi) {
      res.status(422).json({
        success: false,
        message: err.details[0].message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
};
export const resetPassword = async (req, res) => {
  try {
    console.log('req.body', req.body);
    try {
      //Encrypting new password
      let encryptedPassword = await hash(req.body.password, saltRounds);
      console.log('encryptedPassword: ', encryptedPassword);
      //Updating password
      const updatePassword = await updateOne(
        { resetPasswordOtp: req.body.otp },
        {
          $set: {
            resetPasswordOtp: null,
            password: encryptedPassword,
          },
        }
      );
      console.log('updatePassword: ', updatePassword);
      if (updatePassword?.nModified > 0)
        return res.status(200).json({
          success: true,
          message: 'Password Updated',
        });
      else
        return res.status(401).json({
          success: false,
          message: 'Otp not valid',
        });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'internal server error',
      });
    }
  } catch (err) {
    console.log('err.isJoi: ', err);
    if (err.isJoi) {
      res.status(422).json({
        success: false,
        message: err.details[0].message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
};
export const getRoles = async (req, res) => {
  try {
    const roles = await find({});
    return res.status(200).json({
      success: true,
      roles: roles,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
