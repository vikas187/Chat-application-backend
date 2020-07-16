const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
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
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Please enter valid email");
            }
        }
    },
    password: {
        type: String,
        require: true,
        trim: true,
        minLength: 7,
        validate(value) {
            if(value.toLowerCase() == "password") {
                throw new Error("Please enter some other value for password")
            }
        }
    }
});

module.exports = User;