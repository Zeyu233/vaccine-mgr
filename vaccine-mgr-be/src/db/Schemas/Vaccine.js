const mongoose = require('mongoose');
const { getMeta, preSave } = require('../helpers');
const _ = require('../../config/common');

const VaccineSchema = new mongoose.Schema({

  ..._.SCHEMA.TOPIC_MGR,

  meta: getMeta(),
});

VaccineSchema.pre('save', preSave);

mongoose.model('Vaccine', VaccineSchema);
