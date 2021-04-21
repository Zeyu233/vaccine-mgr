const Router = require('@koa/router');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const _ = require('../../config/common');

// const { getBody } = require('../../helpers/utils');

const VaccineClassify = mongoose.model('VaccineClassify');

const router = new Router({
  prefix: '/vaccine-classify',
});

router.get('/list', async (ctx) => {
  const list = await VaccineClassify.find().sort({
    _id: -1,
  }).exec();

  ctx.body = {
    data: list,
    code: 1,
    msg: '获取成功',
  };
});

router.post('/add', async (ctx) => {
  const {
    title,
  } = ctx.request.body;

  const one = await VaccineClassify.findOne({
    title,
  }).exec();

  if (one) {
    ctx.body = {
      code: 0,
      msg: `${_.KEYWORD}分类已经存在`,
    };
    return;
  }

  const vaccineClassify = new VaccineClassify({
    title,
  });

  const saved = await vaccineClassify.save();

  ctx.body = {
    data: saved,
    code: 1,
    msg: '创建成功',
  }
});

router.delete('/:id', async (ctx) => {
  const {
    id,
  } = ctx.params;

  const res = await VaccineClassify.deleteOne({
    _id: id,
  });

  ctx.body = {
    data: res,
    code: 1,
    msg: '删除成功',
  };
});

router.post('/update/title', async (ctx) => {
  const {
    id,
    title,
  } = ctx.request.body;

  const one = await VaccineClassify.findOne({
    _id: id,
  });

  if (!one) {
    ctx.body = {
      msg: '资源不存在',
      code: 0,
    };
    return;
  }

  one.title = title;

  const res = await one.save();

  ctx.body = {
    data: res,
    msg: '修改成功',
    code: 1,
  };
});

module.exports = router;
