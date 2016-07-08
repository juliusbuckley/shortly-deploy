var request = require('request');
var util = require('../lib/utility');

var User = require('../app/models/user');
var Link = require('../app/models/link');


exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({}).exec()
    .then(function(links) {
      res.status(200).json(links);
    })
    .catch(console.error.bind(console));
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }
  Link.findOne({'url': uri}).exec().then(function(link) {
    if (link) {
      res.status(200).send(link);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }

        var newLink = {
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        };
        Link.create(newLink, function(err, link) {
          if (err) { throw err; }
          res.status(200).send(link);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }).exec()
    .then(function(user) {
      if (!user) {
        res.redirect('/login');
      } else {
        user.comparePassword(password, function(match) {
          if (match) {
            console.log('match === true');
            util.createSession(req, res, user);
          } else {
            // console.log('else', user);
            res.redirect('/login');
          }
        });
      }
    });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }).exec()
    .then(function(user) {
      if (!user) {
        var newUser = {
          username: username,
          password: password
        };
        User.create(newUser, function(err, user) {
          if (err) { throw err; }
          util.createSession(req, res, user);
        });
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    });
};

exports.navToLink = function(req, res) {
  Link.findOneAndUpdate({code: req.params[0]}, {$inc: {visits: 1}}).exec()
    .then(function(link) {
      if (!link) {
        res.redirect('/');
      } else {
        res.redirect(link.url);
      }
    });
};
