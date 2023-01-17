'use strict';

var express = require('express');
var router = express.Router();
var data = [{
  image: 'https://www.plazamotors.com.br/uploads/products/versions/colors/new-city-preto-cristal.png',
  brand: 'Fiat/Uno',
  year: '10/10/2020',
  plate: 'ABC-1234',
  color: 'Preto'
},{
  image: 'http://cro.i.uol.com.br/album/carro_branco_f_007.jpg',
  brand: 'Fiat/Palio',
  year: '10/10/2020',
  plate: 'ABC-4321',
  color: 'Branco'
}];

router.get('/', function(req, res) {
  console.log('[GET] /car:', data)
  res.json(data);
});

router.post('/', function(req, res) {
  data.push({
    image: req.body.image,
    brand: req.body.brand,
    year: req.body.year,
    plate: req.body.plate,
    color: req.body.color
  });
  console.log('[POST] /car:', JSON.stringify({
    body: req.body,
    data
  }, null, 2))
  res.json({ message: 'success' });
});

module.exports = router;
