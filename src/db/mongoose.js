const mongoose = require('mongoose');
const keys = require('../config/keys');

const mongo_url = keys.mongoURI;
mongoose.connect(mongo_url, {
    useNewUrlParser: true,
    useCreateIndex: true
});
