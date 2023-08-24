const notifier = require('node-notifier');
const path = require('path');

const sendNotification = (title, message) => {
  notifier.notify({
    title: `Taufiq Project || ${title}`,
    message: message,
    sound: true,
    icon: path.join(__dirname, 'assets/images/favicon.ico'),
  });
};

module.exports = sendNotification;
