const {Router} = require('express');
const router = Router();

/* require model */
const Container = require('../models/Container');

router.get('/', async (req, res) => {
  try {
    const containers = await Container.find();
    res.json(containers);
  } catch(error) {
    next(error);
  }
});

router.post('/find', (req, res, next) => {
  try {
    const {name} = req.body;
    const query = Container.where({ name: name });
    query.findOne((err, users) => {
      if(err) next(err);
      if(users) {
        res.json({status: 200})
      } else {
        res.json({status: 404})
      }
    })
  } catch (error) {
    next(error);
  }
})

router.post('/add', async (req, res, next) => {
  try {
    const containers = new Container(req.body);
    const createdContainer = await containers.save();
    res.json(createdContainer);
  } catch (error) {
    if(error.name === 'ValidationError') {
      res.status(422);
    }
    next(error);
  }
});

router.post('/delete', async (req, res, next) => {
  try {
    const {id} = req.body;
    await Container.findByIdAndDelete(id);
    res.json({status: 200, message: 'Deleted succesfully'});
  } catch (error) {
    next(error);
  }
});

router.post('/edit', async (req, res, next) => {
  try {
    const {id, name, color} = req.body;
    await Container.findByIdAndUpdate(id, { name: name, color: color });
    res.json({status: 200, message: 'Updated succesfully'});
  } catch (error) {
    next(error);
  }
});

module.exports = router;