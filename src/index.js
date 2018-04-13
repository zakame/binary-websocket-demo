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

    var feedApi = new binary.LiveApi({
      appId: appId
    });
    var pricerApi = new binary.LiveApi({
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

    self.stake = ko.observable(100);
    self.callPayout = ko.observable();
    self.putPayout = ko.observable();

    self.isLoading = ko.observable(true);
    self.priceUpdating = ko.observable(true);

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
        return Promise.all([
          feedApi.unsubscribeFromAllTicks(),
          pricerApi.unsubscribeFromAllProposals()
        ]);
      }).then(function () {
        self.chosenTabData(false);
        self.ticks([]);

        self.unsubscribeTimeElapsed(Date.now() - unsubscribeStartTime);
        subscribeStartTime = Date.now();
        self.chosenTabId(tab);

        if (!tab.match(/^R/))
          tab = 'frx' + tab;

        return Promise.all([
          feedApi.getTickHistory(tab, {
            end: 'latest',
            subscribe: 1
          }),
          pricerApi.subscribeToPriceForContractProposal({
            amount: self.stake(),
            basis: 'stake',
            contract_type: 'CALL',
            currency: 'USD',
            duration: 3,
            duration_unit: 'm',
            symbol: tab
          }),
          pricerApi.subscribeToPriceForContractProposal({
            amount: self.stake(),
            basis: 'stake',
            contract_type: 'PUT',
            currency: 'USD',
            duration: 3,
            duration_unit: 'm',
            symbol: tab
          })
        ]);
      }).catch(function (error) {
        var message = error.error ?
          error.error.error.message : error.message;
        self.chosenTabError(message);
        self.isLoading(false);
      }).then(function () {
        self.subscribeTimeElapsed(Date.now() - subscribeStartTime);
      });
    };

    self.updatePrice = function () {
      var tab = self.chosenTabId();
      if (!tab.match(/^R/))
        tab = 'frx' + tab;

      var promise = Promise.resolve();
      promise.then(function () {
        self.priceUpdating(true);
        return pricerApi.unsubscribeFromAllProposals();
      }).then(function () {
        return Promise.all([
          pricerApi.subscribeToPriceForContractProposal({
            amount: self.stake(),
            basis: 'stake',
            contract_type: 'CALL',
            currency: 'USD',
            duration: 3,
            duration_unit: 'm',
            symbol: tab
          }),
          pricerApi.subscribeToPriceForContractProposal({
            amount: self.stake(),
            basis: 'stake',
            contract_type: 'PUT',
            currency: 'USD',
            duration: 3,
            duration_unit: 'm',
            symbol: tab
          })
        ]);
      }).catch(function (error) {
        var message = error.error ?
          error.error.error.message : error.message;
        self.chosenTabError(message);
        self.priceUpdating(false);
      });
    };

    feedApi.events.on('history', function (data) {
      var history = [];
      for (var i = 0; i < data.history.prices.length; i++) {
        history.push({
          position: Date.fromEpoch(data.history.times[i]),
          value: data.history.prices[i]
        });
      }
      self.ticks(history);
    });
    feedApi.events.on('tick', function (data) {
      self.chosenTabData(data.tick);
      self.ticks.push({
        position: Date.fromEpoch(data.tick.epoch),
        value: data.tick.quote
      });
      self.subscriptionId(data.tick.id);
      self.isLoading(false);
    });

    pricerApi.events.on('proposal', function (data) {
      if (data.echo_req.contract_type === 'CALL') {
        self.callPayout(data.proposal.payout);
      }
      if (data.echo_req.contract_type === 'PUT') {
        self.putPayout(data.proposal.payout);
      }
      self.priceUpdating(false);
    });

    self.goToTab(self.tabs[self.tabs.length - 1]);
  }

  ko.applyBindings(new ViewModel());
});
