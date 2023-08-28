const accountSid = 'AC331c8ce5b4da50ad33d6a6b32b5950f9';
const authToken = '7f0d8522645abb04eb0d8a2d35ec1bb9';
const verifySid = 'VAd1d1c231ff31efeded8ebb2a260e0d46';
const client = require('twilio')(accountSid, authToken);

client.verify.v2
  .services(verifySid)
  .verifications.create({ to: '+6285175408518', channel: 'sms' })
  .then((verification) => console.log(verification.status))
  .then(() => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question('Please enter the OTP:', (otpCode) => {
      client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: '+6285175408518', code: otpCode })
        .then((verification_check) => console.log(verification_check.status))
        .then(() => readline.close());
    });
  });
