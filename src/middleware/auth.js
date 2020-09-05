const jwt = require("jsonwebtoken");
const User = require("../models/users");


const auth = async(req, res, next) => {
    try {
        let token = req.header("Authorization");
        token = token.replace('Bearer ', '');
        const decoded = jwt.verify(token, "thisismynewcourse");
        const user = await User.findOne({"_id": decoded._id, "tokens.token": token});
        if(!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    } catch(ex) {
        console.log(ex);
        res.status(400).send("Authenticate user");
    }
}

module.exports = auth;