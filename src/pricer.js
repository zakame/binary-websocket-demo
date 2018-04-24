require('./style.css');

var binary = require('binary-live-api');

require([
  'knockout',
  './util/knockout-spinner',
  './util/knockout-localDateTime'
], function (ko) {
  'use strict';

  ko.components.register('tabs', require('./ko-components/tabs'));

  ko.options.deferUpdates = true;

  function ViewModel() {
    var self = this;

    var api = new binary.LiveApi({ appId: 12038 });

    self.tabs = ['AUDJPY', 'GBPJPY', 'USDJPY', 'EURUSD', 'AUDUSD'];
    self.chosenTabId = ko.observable();
    self.chosenTabError = ko.observable();

    self.stake = ko.observable(100);
    self.callPayout = ko.observable();
    self.putPayout = ko.observable();
    self.spotTime = ko.observable();

    self.isLoading = ko.observable(false);

    self.unsubscribeTimeElapsed = ko.observable();
    self.subscribeTimeElapsed = ko.observable();

    self.goToTab = function (tab) {
      if (self.chosenTabId() === tab)
        return;

      self.chosenTabId(tab);
      self.makeProposals();
    };

    self.makeProposals = function () {
      var subscribeStartTime, unsubscribeStartTime;
      var promise = Promise.resolve();
      promise.then(function () {
        self.chosenTabError(false);
        self.isLoading(true);
        unsubscribeStartTime = Date.now();
        return api.unsubscribeFromAllProposals();
      }).then(function () {
        var tab = 'frx' + self.chosenTabId();

        subscribeStartTime = Date.now();
        self.unsubscribeTimeElapsed(subscribeStartTime - unsubscribeStartTime);

        return Promise.all([
          api.subscribeToPriceForContractProposal({
            amount: self.stake(),
            basis: 'stake',
            contract_type: 'CALL',
            currency: 'USD',
            duration: 3,
            duration_unit: 'm',
            symbol: tab
          }),
          api.subscribeToPriceForContractProposal({
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

    api.events.on('proposal', function (data) {
      if (data.echo_req.contract_type === 'CALL')
        self.callPayout(data.proposal.payout);
      if (data.echo_req.contract_type === 'PUT')
        self.putPayout(data.proposal.payout);

      self.spotTime(data.proposal.spot_time);

      self.isLoading(false);
    });

    self.goToTab(self.tabs[self.tabs.length - 1]);
  }

  ko.applyBindings(new ViewModel());
});
