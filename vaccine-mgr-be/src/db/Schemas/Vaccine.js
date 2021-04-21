const mongoose = require('mongoose');
const { getMeta, preSave } = require('../helpers');
const _ = require('../../config/common');

const VaccineSchema = new mongoose.Schema({
  // // 书名
  // name: String,
  // // 价格
  // price: Number,
  // // 作者
  // author: String,
  // // 出版日期
  // publishDate: String,
  // // 分类
  // classify: String,
  // // 库存
  // count: Number,
  ..._.SCHEMA.TOPIC_MGR,

  meta: getMeta(),
});

VaccineSchema.pre('save', preSave);

mongoose.model('Vaccine', VaccineSchema);