require('./style.css');

var binary = require('binary-live-api');

require([
  'knockout',
  './util/date-fromEpoch',
  './util/knockout-spinner'
], function (ko) {
  'use strict';

  var appId = 12038;

  ko.components.register('tabs', require('./ko-components/tabs'));
  ko.components.register('graph', require('./ko-components/graph'));

  ko.options.deferUpdates = true;

  function ViewModel() {
    var self = this;

    var api = new binary.LiveApi({
      appId: appId
    });

    self.tabs = ['AUDJPY', 'GBPJPY', 'USDJPY', 'R_50', 'R_100'];
    self.chosenTabId = ko.observable();
    self.chosenTabData = ko.observable();
    self.chosenTabError = ko.observable();

    self.ticks = ko.observableArray([]);
    self.maxTicks = ko.observable(300);
    self.chosenTabTicks = ko.computed(function () {
      return self.ticks().slice(0 - self.maxTicks());
    });

    self.isLoading = ko.observable(true);

    self.unsubscribeTimeElapsed = ko.observable();
    self.subscribeTimeElapsed = ko.observable();
    self.subscriptionId = ko.observable();

    self.goToTab = function (tab) {
      if (self.chosenTabId() === tab)
        return;

      var subscribeStartTime;
      var unsubscribeStartTime;

      var promise = Promise.resolve();
      promise.then(function () {
        self.chosenTabError(false);
        self.isLoading(true);
      }).then(function () {
        unsubscribeStartTime = Date.now();
        return api.unsubscribeFromAllTicks();
      }).then(function () {
        self.chosenTabData(false);
        self.ticks([]);

        self.unsubscribeTimeElapsed(Date.now() - unsubscribeStartTime);
        subscribeStartTime = Date.now();
        self.chosenTabId(tab);

        if (!tab.match(/^R/))
          tab = 'frx' + tab;

        return api.getTickHistory(tab, {
          end: 'latest',
          subscribe: 1
        });
      }).catch(function (error) {
        var message = error.error ?
          error.error.error.message : error.message;
        self.chosenTabError(message);
        self.isLoading(false);
      }).then(function () {
        self.subscribeTimeElapsed(Date.now() - subscribeStartTime);
      });
    };

    api.events.on('history', function (data) {
      var history = [];
      for (var i = 0; i < data.history.prices.length; i++) {
        history.push({
          position: Date.fromEpoch(data.history.times[i]),
          value: data.history.prices[i]
        });
      }
      self.ticks(history);
    });
    api.events.on('tick', function (data) {
      self.chosenTabData(data.tick);
      self.ticks.push({
        position: Date.fromEpoch(data.tick.epoch),
        value: data.tick.quote
      });
      self.subscriptionId(data.tick.id);
      self.isLoading(false);
    });

    self.goToTab(self.tabs[self.tabs.length - 1]);
  }

  ko.applyBindings(new ViewModel());
});
