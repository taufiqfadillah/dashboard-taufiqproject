'use strict';

const second = 1000,
  minute = second * 60,
  hour = minute * 60,
  day = hour * 24;

var countDown = new Date('Sep 30, 2025 00:00:00').getTime(),
  x = setInterval(function () {
    var now = new Date().getTime(),
      distance = countDown - now;

    var daysElement = document.getElementById('days');
    var hoursElement = document.getElementById('hours');
    var minutesElement = document.getElementById('minutes');
    var secondsElement = document.getElementById('seconds');

    if (daysElement && hoursElement && minutesElement && secondsElement) {
      daysElement.innerText = Math.floor(distance / day);
      hoursElement.innerText = Math.floor((distance % day) / hour);
      minutesElement.innerText = Math.floor((distance % hour) / minute);
      secondsElement.innerText = Math.floor((distance % minute) / second);
    }
  }, second);
