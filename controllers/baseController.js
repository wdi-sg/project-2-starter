const Review = require('../models/review');
const User = require('../models/user');
const Bookmark = require('../models/bookmark');



module.exports.home = function(req, res) {
  Review.find({}, function(err, result) {
    if (err) throw err;
    // console.log(result);
    // console.log(req.user);
    res.render('base/home', {
      data: result
    });
  });
};



module.exports.profile = function(req, res) {
  Review.find({userId: req.params.id}, function(err, review) {
    if (err) throw err;
    Bookmark.find({userId: req.params.id}, function(err, bookmark) {
      if (err) throw err;
      User.findById(req.params.id, function(err, user) {
        if (err) throw err;
        res.render('base/profile', {
          review: review,
          bookmark: bookmark,
          profile: user
      });
      });
    });
  });
};



module.exports.review = function(req, res) {
  Review.findById(req.params.id).populate('userId').populate('comments.userId').exec(function(err, result) {
    console.log(result);
    if (err) throw err;
    if (result == null) {
      res.render('base/404');
    } else {
    res.render('base/fullreview', {
      data: result
    });
  }
  });


};
