define([], function () {
  'use strict';

  Date.fromEpoch = function (seconds) {
    var date = new Date(0);
    date.setUTCSeconds(seconds);
    return date;
  };

  return Date.fromEpoch;
});
