const mongoose = require('mongoose');
const { getMeta, preSave } = require('../helpers');

const VaccineClassifySchema = new mongoose.Schema({
  title: String,

  meta: getMeta(),
});

VaccineClassifySchema.pre('save', preSave);

mongoose.model('VaccineClassify', VaccineClassifySchema);
