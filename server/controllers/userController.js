const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

const registerController = async (req, res) => {
    try {
        const {userName, email, password} = req.body;
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(200).send({
                success: false,
                msg: "User Already Exists"
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        req.body.password = hashedPass;
        const newUser = new userModel(req.body);
        await newUser.save();
        return res.status(200).send({
            success: true,
            msg: "User Created Successfully"
        })
    } catch (err) {
        res.status(400).json({
            success : false,
            err
        });
    }
}

const loginController = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(200).send({
                success: false,
                msg: "User Not Found"
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(200).send({
                success: false,
                msg: "Password doesn't match"
            })
        }
        res.status(200).send({
            success: true,
            msg: `Hello ${user.name} Logged In Successfully`,
            user
        })
    } catch (err) {
        res.status(400).json({
            success : false,
            err
        });
    }
}

module.exports = {
    loginController,
    registerController
}