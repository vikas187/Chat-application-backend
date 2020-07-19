if(process.env.NODE_ENV === 'production') {
    module.exports = require(__dirname + '/keys_prod');
} else {
    module.exports = require(__dirname + '/keys_dev');
}