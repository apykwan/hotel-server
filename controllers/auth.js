const jwt = require('jsonwebtoken');

const User = require('../models/user');

export const register = async (req, res) => {
    try {
        const { name, email, password, seller } = req.body;

        if (!name) return res
            .status(400).send('Name is required');

        if (!password || password.length < 6) return res
            .status(400).send('Password is required and should be min 6 characters long');

        let userExist = await User.findOne({ email }).exec();
        if (userExist) return res
            .status(400).send('Email is taken!!!');
    
        // register
        const user = new User({ name, email, password, seller });
        console.log(user);
        await user.save();
        // console.log('USER CREATED', user);
        return res.json({ ok: true });
    } catch (err) {
        console.log('CREATE USER FAILED ', err);
        res.status(400).send('Error. Try Again.');
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email })
            .select('-__v +updatedAt +createdAt')
            .exec();
            
        if (!user) return res.status(400).send('User with that email not found');

        // compare password
        user.comparePassword(password, (err, match) => {
            console.log('COMPARE PASSWORD IN LOGIN ERR', err);
            if (!match || err) return res.status(400).send('wrong password');
            console.log('GENERATE A TOKEN THEN SEND AS RESPONSE TO CLIENT');
        });

        // Generate token then send as respose to client
        const token = jwt.sign({ _id: user._id, seller: user.seller }, process.env.JWT_SECRET, { expiresIn: '77d' });
        user.password = undefined;
        // console.log("LOGIN USER ", user);
        res.json({ 
            token, 
            user
        });
    } catch (err) {
        console.log('LOGIN ERROR', err);
        res.status(400).send("Login Failed!!!")
    }
};