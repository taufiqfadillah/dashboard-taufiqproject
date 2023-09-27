const mongoose = require('mongoose');

const barcodeSchema = new mongoose.Schema(
  {
    email: String,
    name: String,
    organization: String,
    date: String,
    barcode: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Barcode', barcodeSchema);
