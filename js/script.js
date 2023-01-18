(function($, doc) {
  'use strict';

  var app = (function() {
    var $image = $('[data-js="image"]').get();
    var $brand = $('[data-js="brand-model"]').get();
    var $year = $('[data-js="year"]').get();
    var $color = $('[data-js="color"]').get();
    var $plate = $('[data-js="plate"]').get();
    var $listErrors = $('[data-js="list-errors"]').get();
    var $tableCar = $('[data-js="table-car"]').get();
    var errors = [];
    var listCars = [];

    return {
      init: function init() {
        this.onloadCars();
        this.companyInfo();
        this.initEvents();
      },

      initEvents: function initEvents(){
        $('[data-js="form-register"]').on('submit', this.handleSubmit);
      },

      initRemove: function initRemove(){
        $('[data-js="remove-car"]').on('click', this.removeCar);
      },

      onloadCars: function onloadCars(){
        var get = new XMLHttpRequest();
        get.open('GET', 'http://localhost:3000/car');
        get.send();

        get.onreadystatechange = function(e){
          if(get.readyState === 4 && get.status === 200){
            var cars = JSON.parse(get.responseText);
            listCars = cars;

            console.log(cars);
            cars.forEach(function(car){
              var $tableCar = $('[data-js="table-car"]').get();
              $tableCar.appendChild(app.createNewCar(car.id, car.image, car.plate, car.year, car.color, car.brand));
              app.initRemove();
            });
          };
        }
      },

        handleSubmit: function handleSubmit(e){
          e.preventDefault();

          app.clearErrors();
          if(app.validationForm()){
            app.submitNewCar();
            app.clearTable();
            app.onloadCars();
            app.clearForm();
          } else {
            app.viewErrors();
          }
        },

      createNewCar: function createNewCar(id, image, plate, year, color, brand){
        var $fragment = doc.createDocumentFragment();
        var $tr = doc.createElement('tr');
        var $tdImage = doc.createElement('td');
        var $image = doc.createElement('img');
        var $tdBrand = doc.createElement('td');
        var $tdYear = doc.createElement('td');
        var $tdPlate = doc.createElement('td');
        var $tdColor = doc.createElement('td');
        var $tdRemover = doc.createElement('td');

        $tr.setAttribute('data-js', id);

        $image.setAttribute('src', image);
        $tdImage.appendChild($image);

        var $btnRemover = doc.createElement('button');
        $btnRemover.textContent = 'Remover';
        $btnRemover.setAttribute('data-js', 'remove-car');
        $btnRemover.setAttribute('class', 'btn-remove');
        $btnRemover.setAttribute('id', id);
        $tdRemover.appendChild($btnRemover);

        $tdBrand.textContent = brand;
        $tdYear.textContent = year;
        $tdPlate.textContent = plate;
        $tdColor.textContent = color;

        $tr.appendChild($tdImage);
        $tr.appendChild($tdBrand);
        $tr.appendChild($tdYear);
        $tr.appendChild($tdPlate);
        $tr.appendChild($tdColor);
        $tr.appendChild($tdRemover);

        return $fragment.appendChild($tr);
      },

      submitNewCar: function submitNewCar(){
        var ajax = new XMLHttpRequest();
        var car = '';
        var id = 'car-' + this.generateID();
        ajax.open('POST','http://localhost:3000/car');
        ajax.setRequestHeader(
          'Content-Type',
          'application/x-www-form-urlencoded'
        );
        ajax.send('image=' + $image.value
                  +'&brand=' + $brand.value
                  +'&year=' + $year.value
                  +'&plate=' + $plate.value
                  +'&color=' + $color.value
                  + '&id=' + id);
        ajax.onreadystatechange = function(e){

          if(ajax.readyState === 4 && ajax.status === 200){
            console.log('Carro Cadastrado')
            console.log(JSON.parse(ajax.responseText), ajax.status);
            var newCar = JSON.parse(ajax.responseText);
            car = app.createNewCar(newCar.image, newCar.plate, newCar.year, newCar.color, newCar.brand);
          }

        };
        return car;
      },


      validationForm: function validationForm(){
        if($image.value === '')
          this.messageError('Precisa adicionar um imagem');

        if($brand.value === '')
          this.messageError('Precisa preencher a marca');

        if($year.value === '')
          this.messageError('Precisa preencher um ano');

        if($color.value === '')
          this.messageError('Precisa preencher a cor');

        if($plate.value === '')
          this.messageError('Precisa preencher a placa');

        if(errors.length > 0)
          return false;

        return true;
      },

      generateID: function generateID(){
        return Math.floor(Date.now() * (Math.random() * 10));;
      },

      removeCar: function removeCar(){
        var dataJS = '[data-js="id"]'.replace('id', this.id)
        var $car = $(dataJS).get();
        console.log($car);

        var deleted = new XMLHttpRequest();
        deleted.open('DELETE','http://localhost:3000/car');
        deleted.setRequestHeader( 'Content-Type','application/x-www-form-urlencoded' );
        deleted.send('id=' + this.id);
        deleted.onreadystatechange = function(e){
          if(deleted.readyState === 4 && deleted.status === 200){
            console.log('Carro Deletado com Sucesso!')
            console.log(JSON.parse(deleted.responseText), deleted.status);
            $car.remove();
          }
        };
      },

      clearForm: function clearForm(){
        $image.value = '',
        $brand.value = '',
        $year.value = '',
        $plate.value = '',
        $color.value = ''
      },

      messageError: function messageError(msg){
        errors.push(msg);
      },

      viewErrors: function viewErrors(){
        errors.map(function(element){
          var $li = doc.createElement('li');
          $li.textContent = element;
          $listErrors.appendChild($li);
        });
      },

      clearTable: function(){
        $tableCar.innerHTML = '';
      },

      clearErrors: function clearErrors(){
        errors = [];
        $listErrors.innerHTML = '';
      },

      companyInfo: function companyInfo() {
        var ajax = new XMLHttpRequest();
        ajax.open('GET', '../data/company.json', true);
        ajax.send();
        ajax.addEventListener('readystatechange', this.getcompanyInfo, false);
      },

      getcompanyInfo: function getcompanyInfo() {
        if(!app.isReady.call(this))
          return;

        var data = JSON.parse(this.responseText);
        var $companyName = $('[data-js="company-name"]').get();
        var $companyPhone = $('[data-js="company-phone"]').get();
        $companyName.textContent = data.name;
        $companyPhone.textContent = data.phone;
      },

      isReady: function isReady(){
        return this.readyState === 4 && this.status === 200;
      }
    };
  })();

  app.init();

})(window.DOM, document);
