'use strict';

var express = require('express');
var router = express.Router();
var data = [];

router.get('/', function(req, res) {
  res.json(data);
});

router.post('/', function(req, res) {
  data.push({
    id: req.body.id,
    image: req.body.image,
    brand: req.body.brand,
    year: req.body.year,
    plate: req.body.plate,
    color: req.body.color
  });
  res.json({ message: 'success' });
});

router.delete('/', function(req, res) {
  data = data.filter(function(car) {
    return car.id !== req.body.id;
  });
  res.json({ message: 'success' });
});

module.exports = router;
