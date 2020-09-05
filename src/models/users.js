const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Task = require('./tasks');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        trim: true,
        required: true
    },
    lastname: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Please enter valid email");
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        validate(value) {
            if(value.toLowerCase() == "password") {
                throw new Error("Please enter some other value for password")
            }
        }
    },
    avatar: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.methods.toJSON = function() {
    const user= this;
    const userObject = user.toObject();
    delete userObject.password;
    //delete userObject.tokens;

    return userObject;
}

userSchema.methods.getAuthToken = async function() {
    try {
        const user = this;
        const token = jwt.sign({"_id": user._id.toString()}, "thisismynewcourse");
        user.tokens = user.tokens.concat({token});
        console.log(user.tokens);
        await user.save();
        return token;
    } catch(ex) {
        console.log(ex);
        throw new Error(ex);
    }
    
}

userSchema.statics.findByCredentials = async(email, password)=>{
    try {
        const user = await User.findOne({email});
        console.log(user);
        
        if(!user) {
            throw new Error("Please enter valid details");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch);
        if(!isMatch) {
            throw new Error("Please enter valid details");
        }
        return user;
    } catch(ex) {
        throw new Error(ex.message);
    }
    
};

userSchema.pre('save', async function (next) {
    const user = this;
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

userSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({owner: user._id});
    next();
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

const User = mongoose.model('User', userSchema);





module.exports = User;