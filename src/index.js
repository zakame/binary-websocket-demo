require('./style.css');

require(['binary-live-api', 'knockout'], function(binary, ko) {
  'use strict';

  var appId = 12038;

  Date.fromEpoch = function(seconds) {
    var date = new Date(0);
    date.setUTCSeconds(seconds);
    return date;
  };

  ko.options.deferUpdates = true;

  ko.bindingHandlers.d3LineGraph = require(['knockout-d3-line-graph']);

  ko.bindingHandlers.localDateTime = {
    update: function(element, valueAccessor) {
      var date = Date.fromEpoch(ko.unwrap(valueAccessor()));
      element.innerHTML =
        date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
  };

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
    self.chosenTabTicks = ko.computed(function() {
      return self.ticks().slice(0 - self.maxTicks());
    });

    self.unsubscribeTimeElapsed = ko.observable();
    self.subscribeTimeElapsed = ko.observable();

    self.goToTab = function(tab) {
      if (self.chosenTabId() === tab)
        return;

      var unsubscribeStartTime = Date.now();
      api.unsubscribeFromAllTicks().then(function() {
        self.chosenTabData(false);
        self.chosenTabError(false);
        self.ticks([]);

        self.unsubscribeTimeElapsed(Date.now() - unsubscribeStartTime);
        var subscribeStartTime = Date.now();
        self.chosenTabId(tab);

        if (!tab.match(/^R/)) {
          tab = 'frx' + tab;
        }

        api.getTickHistory(tab, {
          end: 'latest',
          subscribe: 1
        }).then(function() {
          self.subscribeTimeElapsed(Date.now() - subscribeStartTime);
        }).catch(function(error) {
          self.chosenTabError(error.error.error.message);
        })
      })
    };

    api.events.on('history', function(data) {
      var history = [];
      for (var i = 0; i < data.history.prices.length; i++) {
        history.push({
          position: Date.fromEpoch(data.history.times[i]),
          value: data.history.prices[i]
        });
      }
      self.ticks(history);
    });
    api.events.on('tick', function(data) {
      self.chosenTabData(data.tick);
      self.ticks.push({
        position: Date.fromEpoch(data.tick.epoch),
        value: data.tick.quote
      });
    });

    self.goToTab(self.tabs[self.tabs.length - 1]);
  }

  ko.applyBindings(new ViewModel());
});
