const Router = require('@koa/router');
const mongoose = require('mongoose');
const config = require('../../project.config');
const { getBody } = require('../../helpers/utils');
const { loadExcel, getFirstSheet } = require('../../helpers/excel');
const _ = require('../../config/common');

const GOOD_CONST = {
  IN: 'IN_COUNT',
  OUT: 'OUT_COUNT',
};

const Vaccine = mongoose.model('Vaccine');
const InventoryLog = mongoose.model('InventoryLog');
const VaccineClassify = mongoose.model('VaccineClassify');

const findVaccineOne = async (id) => {
  const one = await Vaccine.findOne({
    _id: id,
  }).exec();

  return one;
};

const router = new Router({
  prefix: '/vaccine',
});

router.get('/listOrd', async (ctx) => {
  // console.log("listMAx")
  let = {
    size = 5,
    order
  } = ctx.query;

  size = Number(size);
  order = Number(order);
  // console.log(order);
  let list;
  if (order == 1) {
    list = await Vaccine
      .find()
      .sort({
        count: 1,
      })
      .limit(size)
      .exec();

      // console.log("qqqq")
  } else {
    list = await Vaccine
      .find()
      .sort({
        count: -1,
      })
      .limit(size)
      .exec();

      // console.log("1111")
  }
  ctx.body = {
    data: {
      list,
      size,
    },
    code: 1,
    msg: '获取列表成功',
  };
});

router.get('/list', async (ctx) => {

  const {
    page = 1,
    keyword = '',
  } = ctx.query;

  let = {
    size = 10,
  } = ctx.query;

  size = Number(size);

  // 2 20
  // 20 20
  // (page - 1) * size

  const query = {};

  if (keyword) {
    query.name = keyword;
  }

  const list = await Vaccine
    .find(query)
    .sort({
      _id: -1,
    })
    .skip((page - 1) * size)
    .limit(size)
    .exec();

  const total = await Vaccine.countDocuments();

  ctx.body = {
    data: {
      total,
      list,
      page,
      size,
    },
    code: 1,
    msg: '获取列表成功',
  };
});

router.delete('/:id', async (ctx) => {
  const {
    id,
  } = ctx.params;

  const delMsg = await Vaccine.deleteOne({
    _id: id,
  });

  ctx.body = {
    data: delMsg,
    msg: '删除成功',
    code: 1,
  };
});

router.post('/update/count', async (ctx) => {
  const {
    id,
    type,
  } = ctx.request.body;

  let {
    num,
  } = ctx.request.body;

  num = Number(num);

  const vaccine = await findVaccineOne(id);

  if (!vaccine) {
    ctx.body = {
      code: 0,
      msg: `没有找到${_.KEYWORD}`,
    };

    return;
  }

  // 找到了
  if (type === GOOD_CONST.IN) {
    // 入库操作
    num = Math.abs(num);
  } else {
    // 出库操作
    num = -Math.abs(num);
  }

  vaccine.count = vaccine.count + num;

  if (vaccine.count < 0) {
    ctx.body = {
      code: 0,
      msg: '剩下的量不足以出库',
    };
    return;
  }

  const res = await vaccine.save();
  // console.log(vaccine);
  const log = new InventoryLog({
    name:vaccine.name,
    num: Math.abs(num),
    type,
  });

  log.save();

  ctx.body = {
    data: res,
    code: 1,
    msg: '操作成功',
  };
});

router.post('/update', async (ctx) => {
  const {
    id,
    ...others
  } = ctx.request.body;

  const one = await findVaccineOne(id);

  // 没有找到
  if (!one) {
    ctx.body = {
      msg: `没有找到${_.KEYWORD}`,
      code: 0,
    }
    return;
  }

  const newQuery = {};

  Object.entries(others).forEach(([key, value]) => {
    if (value) {
      newQuery[key] = value;
    }
  });

  Object.assign(one, newQuery);

  const res = await one.save();

  ctx.body = {
    data: res,
    code: 1,
    msg: '保存成功',
  };
});

router.get('/detail/:id', async (ctx) => {
  const {
    id,
  } = ctx.params;

  const one = await findVaccineOne(id);

  // 没有找到
  if (!one) {
    ctx.body = {
      msg: `没有找到${_.KEYWORD}`,
      code: 0,
    };

    return;
  }

  ctx.body = {
    msg: '查询成功',
    data: one,
    code: 1,
  };
});

router.post('/addMany', async (ctx) => {
  const {
    key = '',
  } = ctx.request.body;

  const path = `${config.UPLOAD_DIR}/${key}`;

  const excel = loadExcel(path);

  const sheet = getFirstSheet(excel);

  const arr = [];
  for (let i = 0; i < sheet.length; i++) {
    let record = sheet[i];

    const [
      name,
      price,
      producedDate,
      expirationDate,
      classify,
      count,
    ] = record;

    let classifyId = classify;

    const one = await VaccineClassify.findOne({
      title: classify,
    });

    if (one) {
      classifyId = one._id;
    }

    arr.push({
      name,
      price,
      producedDate,
      expirationDate,
      classify: classifyId,
      count,
    });
  }

  await Vaccine.insertMany(arr);

  ctx.body = {
    code: 1,
    msg: '添加成功',
    data: {
      addCount: arr.length,
    },
  };
});

router.post('/add', async (ctx) => {
  const {
    name,
    price,
    producedDate,
    expirationDate,
    classify,
    count,
  } = getBody(ctx);

  const vaccine = new Vaccine({
    name,
    price,
    expirationDate,
    producedDate,
    classify,
    count,
  });

  const res = await vaccine.save();

  ctx.body = {
    data: res,
    code: 1,
    msg: '添加成功',
  };
});

module.exports = router;
