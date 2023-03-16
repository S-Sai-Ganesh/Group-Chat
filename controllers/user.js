const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.postUser = async (req, res, next) => {
    try {
        const {name,email,password,number} = req.body;

        const userExist = await User.findAll({where: {email}});
        
        if(userExist){
            res.status(207).json({ message: 'User already exist' });
        } else {
            bcrypt.hash(password, 10, async (err, hash) => {
                if(err) console.log(err);
                await User.create({ name, email, password: hash, number });
                return res.status(201).json({ message: 'User Signup successful' });
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
};