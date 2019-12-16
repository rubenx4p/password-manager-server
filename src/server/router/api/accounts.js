const router = require('express').Router();

router.get('/', function(req, res, next) {
    res.status(200).json({
        message: "Handling GET request to /accounts"
      });
  });

router.post('/', function(req, res, next) {
    res.status(201).json({
        message: "Handling POST request to /accounts"
      });
  });
router.patch('/', function(req, res, next) {
    res.status(200).json({
        message: "Handling PATCH request to /accounts"
      });
  });

  module.exports = router;