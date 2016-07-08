var mongoose = require('../config');
var crypto = require('crypto');


var linkSchema = new mongoose.Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number
});

linkSchema.pre('this', function() {
  var shasum = crypto.createHash('sha1');
  shasum.update(model.get('url'));
  this.set('code', shasum.digest('hex').slice(0, 5));
});

module.exports = mongoose.model('Link', linkSchema);











// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function() {
//     this.on('creating', function(model, attrs, options) {
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

// module.exports = Link;
