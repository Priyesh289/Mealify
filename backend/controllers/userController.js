import UserModel from "../models/userModel.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'

//login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        //Find User 
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        //Match Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Credentials" });
        }

        const token = createToken(user._id);
        return res.json({ success: true, message: "User Loing", token })
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: "Error", });
    }
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_KEY)
}

//register user
const registerUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        //checking is user already exist
        const userExist = await UserModel.findOne({ email });
        if (userExist) {
            return res.json({ success: false, message: "User already exist" });
        }

        //validating email format and strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please Enter a Valid Email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please Enter Strong Password" });
        }

        //hasing a User Password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        //create new User
        const newUser = new UserModel({
            name: name,
            email: email,
            password: hashPassword,
        })
        const user = await newUser.save();
        const token = createToken(user._id);

        return res.json({ success: true, token });
    } catch (error) {
        
        return res.json({ success: false, message: 'Error' })
    }
}


export { registerUser, loginUser }