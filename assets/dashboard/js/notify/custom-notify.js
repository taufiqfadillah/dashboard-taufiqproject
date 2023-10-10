'use strict';

var CustomNotify = (function () {
  var showNotification = function (message, type) {
    $.notify(
      {
        title: 'Taufiq Project Notification',
        message: message,
      },
      {
        type: type,
        allow_dismiss: true,
        newest_on_top: true,
        mouse_over: true,
        showProgressbar: false,
        spacing: 10,
        timer: 2000,
        placement: {
          from: 'bottom',
          align: 'right',
        },
        offset: {
          x: 30,
          y: 30,
        },
        delay: 1000,
        z_index: 10000,
        animate: {
          enter: 'animated rubberBand',
          exit: 'animated rubberBand',
        },
      }
    );
  };

  return {
    success: function (message) {
      showNotification(message, 'success');
    },
    error: function (message) {
      showNotification(message, 'danger');
    },
    info: function (message) {
      showNotification(message, 'info');
    },
    warning: function (message) {
      showNotification(message, 'warning');
    },
  };
})();
