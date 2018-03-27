define(['knockout', 'lodash/extend', 'spin.js'], function (ko, extend, spin) {
  'use strict';

  var Spinner = spin.Spinner;

  ko.bindingHandlers.spinner = {
    init: function (element, valueAccessor, allBindings) {
      element.spinner = new Promise(function (resolve, reject) {
        setTimeout(function () {
          var options = {};
          options.color = getComputedStyle(element).color;
          extend(options, ko.bindingHandlers.spinner.defaultOptions,
            ko.unwrap(allBindings.get('spinnerOptions')));

          resolve(new Spinner(options));
        }, 30);
      });
    },
    update: function (element, valueAccessor) {
      var result = ko.unwrap(valueAccessor());
      element.spinner.then(function (spinner) {
        var isSpinning = result;
        if (isSpinning) {
          element.style.display = '';
          spinner.spin(element);
        }
        else {
          if (spinner.el) {
            spinner.stop();
          }
          element.style.display = 'none';
        }
      });
    },
    defaultOptions: {
      lines: 19,
      length: 0,
      width: 2,
      corners: 0,
      radius: 5,
      speed: 2.5,
      trail: 20
    }
  };

  return ko.bindingHandlers.spinner;
});
