const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { UserValidation } = require('../helpers/validation')

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
            return res.status(403).json({ success: true, errMsg: `${existKey} Already Taken!!` });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: true, errMsg: `${existKey} Already Taken!!` });
    }

    const user = new User({
        username, firstName, lastName, email, password: bcrypt.hashSync(password, 10)
    });

    try {
        let newUser = await user.save();
        return res.status(201).json(newUser);
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

exports.login = async (req, res) => {
    const { error, value } = UserValidation.login.validate(req.body);
    if (error) return res.status(400).json({ success: false, errMsg: error.details[0].message });

    const { email, password } = value;
    try {
        let user = await User.findOne({ 'email': email }, 'email password isAdmin');

        if (user && bcrypt.compareSync(password, user.password)) {
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
        return res.status(400).render('login', {
            subTitle: '- Login',
            status: {
                form: 'login',
                status: 'danger',
                message: error.details[0].message
            },
            formData: req.body
        });

    }
    let message = 'Couldn\'t register. Something went wrong.';


    const { email, password } = value;
    let user = await User.findOne({ 'email': email });

    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({
            id: user.id,
            isAdmin: user.isAdmin
        }, process.env.SECRET || 'this_is_@_temp.secret')
        req.session.user = { id: user.id, isAdmin: user.isAdmin, token: token };
        return res.redirect('/search');
    }
    return res.status(404).render('login', {
        subTitle: '- Login',
        status: {
            form: 'login',
            status: 'danger',
            message: "Invalid Email or Password!"
        },
        formData: req.body
    });
}

exports.logout = async (req, res) => {
    return req.session.destroy(err => {
        res.redirect('/');
    })
}