const mongoose = require('mongoose');

const barcodeSchema = new mongoose.Schema({
  email: String,
  name: String,
  organization: String,
});

module.exports = mongoose.model('Barcode', barcodeSchema);
