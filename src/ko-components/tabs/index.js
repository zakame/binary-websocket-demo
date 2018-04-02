define(['knockout', './templates/index.html'], function (ko, template) {
  'use strict';

  return {
    viewModel: function (params) {
      var self = this;

      self.value = params.value;
      self.selected = params.selected;

      self.click = function (tab) { params.click(tab); };
    },
    template: template
  };
});
