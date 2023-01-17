(function($, doc) {
  'use strict';

  var app = (function() {
    var $image = $('[data-js="image"]').get();
    var $brand = $('[data-js="brand-model"]').get();
    var $year = $('[data-js="year"]').get();
    var $color = $('[data-js="color"]').get();
    var $plate = $('[data-js="plate"]').get();
    var $listErrors = $('[data-js="list-errors"]').get();
    var errors = [];

    return {
      init: function init() {
        this.companyInfo();
        this.initEvents();
      },

      initEvents: function initEvents(){
        $('[data-js="form-register"]').on('submit', this.handleSubmit);
      },

      initRemove: function initRemove(){
        $('[data-js="remove-car"]').on('click', this.removeCar);
      },

      handleSubmit: function handleSubmit(e){
        e.preventDefault();

        app.clearErrors();
        if(app.validationForm()){
          var $tableCar = $('[data-js="table-car"]').get();
          $tableCar.appendChild(app.createNewCar());
          app.clearForm();
          app.initRemove();
        } else {
          app.viewErrors();
        }
      },

      createNewCar: function createNewCar(){
        var $fragment = doc.createDocumentFragment();
        var $tr = doc.createElement('tr');
        var $tdImage = doc.createElement('td');
        var $image = doc.createElement('img');
        var $tdBrand = doc.createElement('td');
        var $tdYear = doc.createElement('td');
        var $tdPlate = doc.createElement('td');
        var $tdColor = doc.createElement('td');
        var $tdRemover = doc.createElement('td');

        var id = 'carNumber-' + this.generateID();

        $tr.setAttribute('data-js', id);

        $image.setAttribute('src', $('[data-js="image"]').get().value);
        $tdImage.appendChild($image);

        var $btnRemover = doc.createElement('button');
        $btnRemover.textContent = 'Remover';
        $btnRemover.setAttribute('data-js', 'remove-car');
        $btnRemover.setAttribute('class', 'btn-remove');
        $btnRemover.setAttribute('id', id);
        $tdRemover.appendChild($btnRemover);

        $tdBrand.textContent = $brand.value;
        $tdYear.textContent = $year.value;
        $tdPlate.textContent = $plate.value;
        $tdColor.textContent = $color.value;

        $tr.appendChild($tdImage);
        $tr.appendChild($tdBrand);
        $tr.appendChild($tdYear);
        $tr.appendChild($tdPlate);
        $tr.appendChild($tdColor);
        $tr.appendChild($tdRemover);

        return $fragment.appendChild($tr);
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
        $car.remove();
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
