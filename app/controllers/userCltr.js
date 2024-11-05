const UserModal = require('../modals/user')
const jwt = require('jsonwebtoken')
const _ = require('lodash');
const bcrypt = require('bcryptjs')


const user_register = async (req, res) => {
    const body = _.pick(req.body, ['firstname', "lastname", "email", "password", "confirmpassword"]);
    const useremail = await UserModal.findOne({ email: body.email });

    if (useremail) {
        return res.status(404).json({ msg: "Email already registered" });
    }

    try {
        const user = new UserModal({
            firstname: body.firstname,
            lastname: body.lastname,
            email: body.email
        });


        const salt = await bcrypt.genSalt();
        const hashpass = await bcrypt.hash(body.password, salt);
        user.password = hashpass;


        const usr = await user.save();


        res.json({
            msg: "User registered successfully",
            user: {
                firstname: usr.firstname,
                lastname: usr.lastname,
                email: usr.email,
                password: "**********",
                confirmpassword: "**********"
            }
        });
    } catch (e) {
        console.error('Error in registration:', e);
        res.status(500).json({ msg: "Registration failed" });
    }
};

const user_login = async (req, res) => {
    const body = _.pick(req.body, ['email', 'password'])

    try {
        const user = await UserModal.findOne({ email: body.email })
        if (user) {
            const match = await bcrypt.compare(body.password, user.password)
            if (match) {
                const tokenData = { id: user._id }
                const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '7d' })
                res.json({ token: token, msg: "login successfully" })
            } else {
                res.status(400).json({ msg: "Invalid password/email" })
            }
        } else {
            res.status(400).json({ msg: "Invalid password/email" })
        }

    } catch (e) {
        console.error('Error in login', e)
        res.status(500).json({ msg: 'Internal server error' })
    }
}

const getProfile = async (req, res) => {
    try {
        const user = await UserModal.findById(req.user.id).select("-password -confirmpassword")
        if (user) {
            return res.json(user);
        } else {
            return res.status(404).json({ msg: 'User not found' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
};


module.exports = {
    user_register,
    user_login,
    getProfile
}