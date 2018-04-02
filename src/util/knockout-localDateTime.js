define(['knockout', './date-fromEpoch'], function (ko) {
  'use strict';

  ko.bindingHandlers.localDateTime = {
    update: function (element, valueAccessor) {
      var date = Date.fromEpoch(ko.unwrap(valueAccessor()));
      element.innerHTML =
        date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
  };

  return ko.bindingHandlers.localDateTime;
});
