define([
  'knockout',
  './templates/index.html',
  'knockout-d3-line-graph',
  '../../util/knockout-localDateTime',
], function (ko, template) {
  'use strict';

  return {
    viewModel: function (params) {
      var self = this;

      self.id = params.id;
      self.data = params.data;

      self.ticks = params.ticks;

      self.subscriptionId = params.subscriptionId;
      self.unsubscribeTimeElapsed = params.unsubscribeTimeElapsed;
      self.subscribeTimeElapsed = params.subscribeTimeElapsed;
    },
    template: template
  };
});
