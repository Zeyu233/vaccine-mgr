const mongoose = require('mongoose');
const { getMeta, preSave } = require('../helpers');

const InventoryLogSchema = new mongoose.Schema({
  type: String,
  num: Number,
  name: String,

  meta: getMeta(),
});

InventoryLogSchema.pre('save', preSave);

mongoose.model('InventoryLog', InventoryLogSchema);
