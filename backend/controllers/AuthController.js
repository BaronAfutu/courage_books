const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { UserValidation } = require('../helpers/validation')
const { sendMail } = require('../config/email');

/**
 * @type {mongoose.Model}
 */
const User = require('../models/User');


exports.signup = async (req, res) => {

    const { error, value } = UserValidation.create.validate(req.body);
    if (error) return res.status(400).json({ success: false, errMsg: error.details[0].message });


    const { username, email, firstName, lastName, password } = value;

    try {
        const existUser = await User.findOne({ $or: [{ email: email }, { username: username }] }, 'email username');
        if (existUser) {
            let existKey = '';
            for (let key in value) {
                if (value[key] === existUser[key]) {
                    existKey = key;
                    break
                }
            }
            return res.status(403).json({ success: false, message: `${existKey} already taken!!` });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: `Error Signing Up. Try again later...` });
    }



    const verificationCode = Date.now().toString(16);
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    const user = new User({
        username, firstName, lastName, email, password: bcrypt.hashSync(password, 10), verificationCode, verificationCodeExpires
    });

    try {
        let newUser = await user.save();
        const verificationLink = `${process.env.NODE_ENV==='DEV'?'localhost:3000':'www.jpalorwu.com'}/verify?user=${newUser._id}&code=${verificationCode}`;
        const html = `
            <h1>Welcome to JP Alorwu</h1>
            <p>Hello, ${username},</p>
            <br>
            <p>Please <a href="${verificationLink}">click here</a> to verify your Email Address. It is valid for 15 minutes</p>
            <p>You can also copy and paste this link in your browser if clicking does not work.</p>
            <p>Link: <a href="${verificationLink}">${verificationLink}</a></p>
            <br>
            <p>If you did not ask create an account with us, you can ignore this email</p>
            <p>Thanks,<br>JP Alorwu</p>
        `;
        await sendMail(email, "JP Alorwu - Please Verify your email address", html);

        console.log("Verification code sent to " + email);
        return res.status(201).json(newUser);

    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

exports.verifyEmailCode = async (req, res) => {
    try {
      const { user, code } = req.query; // Get email and code from request body
  
      // Find the user by email
      let theUser = await User.findById(user, 'email password verificationCode');
  
      if (!theUser) {
        return res.status(404).json({ message: "User not found." });
      }
  
      //Check if the verification code matches and is still valid
      if (
        theUser.verificationCode !== code ||
        Date.now() > theUser.verificationCodeExpires
      ) {
        return res
          .status(400)
          .json({ message: "Invalid or expired verification code." });
      }
  
      //Mark the user as verified
      theUser.isVerified = true;
      theUser.verificationCode = null; // Clear verification code after successful verification
      theUser.verificationCodeExpires = null; // Clear expiration after verification
      await theUser.save();
  
      res.redirect('/login?msg=verified');
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

exports.login = async (req, res) => {
    const { error, value } = UserValidation.login.validate(req.body);
    if (error) return res.status(400).json({ success: false, errMsg: error.details[0].message });

    const { email, password } = value;
    try {
        let user = await User.findOne({ 'email': email }, 'email password isAdmin isVerified');

        if(user && !user.isVerified){
            return res.status(403).json({success:false, message:'Verify your account before loggin in!!'});
        }

        if (user && user.isVerified && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({
                id: user.id,
                isAdmin: user.isAdmin
            }, process.env.SECRET || 'this_is_@_temp.secret')
            return res.status(200).json({ success: true, id: user.id, token })
        } else {
            return res.status(404).json({ success: false });
        }
    } catch (error) {
        return res.status(500).json({ success: false });
    }
}

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @returns 
 */
exports.signin = async (req, res) => { // Returns Page, user session
    const { error, value } = UserValidation.login.validate(req.body);
    if (error) {
        console.log(error)
        return res.status(400).render('login', {
            subTitle: 'Login',
            status: {
                form: 'login',
                status: 'danger',
                message: error.details[0].message
            },
            title: "huh1",
            formData: req.body
        });

    }
    let message = 'Couldn\'t Login. Something went wrong.';


    const { email, password } = value;
    let user = await User.findOne({ 'email': email }, 'email password isAdmin isVerified');

    if (user && user.isVerified && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({
            id: user.id,
            isAdmin: user.isAdmin
        }, process.env.SECRET || 'this_is_@_temp.secret')
        req.session.user = { id: user.id, isAdmin: user.isAdmin, token: token };
        // TODO check for next
        // if(req.query.newuser){
        //     return res.redirect('/user/profile');
        // }
        return res.redirect('/');
    }
    return res.status(404).render('login', {
        subTitle: '- Login',
        status: {
            form: 'login',
            status: 'danger',
            message: "Invalid Email or Password Or Account not verified!"
        },
        title: 'Login',
        user:undefined,
        token: '',
        formData: req.body
    });
}

exports.logout = async (req, res) => {
    return req.session.destroy(err => {
        res.redirect('/');
    })
}