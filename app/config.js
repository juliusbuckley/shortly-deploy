var mongoose = require('mongoose');

var url = process.env.DATABASEURL || 'mongodb://localhost:27017/shortly';

mongoose.connect(url);

module.exports = mongoose;