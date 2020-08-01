const {Router} = require('express');
const router = Router();

/* require model */
const Container = require('../models/Container');
const Item = require('../models/Item');

// get all
router.get('/', async (req, res) => {
  try {
    const containers = await Container.find();
    res.json(containers);
  } catch(error) {
    next(error);
  }
});

// find one
router.get('/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    const container = await Container.findOne({
      _id: id,
    });
    res.json(container);
  } catch (error) {
    next(error);
  }
})

// save
router.post('/', async (req, res, next) => {
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

// delete
router.delete('/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    await Container.findByIdAndDelete(id);
    res.json({status: 200, message: 'Deleted succesfully'});
  } catch (error) {
    next(error);
  }
});

// edit
router.put('/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    await Container.findOne({
      _id: id,
    }, (error) => {
      if(error) next(error);
    });
    await Container.update({_id:id}, req.body);
    res.json({status: 200, message: 'Updated succesfully'})
  } catch (error) {
    next(error);
  }
});

/* ITEMS */

// get all
router.get('/:id/items', async (req, res, next) => {
  try {
    const {id} = req.params;
    const items = await Item.find({container_id:id}, (error) => {if(error) next(error)});
    res.json(items);
  } catch (error) {
    next(error);
  }
});

// find one
router.get('/:id/items/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    const item = await Item.findOne({
      _id: id,
    });
    res.json(item);
  } catch (error) {
    next(error);
  }
})

// save
router.post('/:id/items', async (req, res, next) => {
  try {
    const items = new Item(req.body);
    const createdItem = await items.save();
    res.json(createdItem);
  } catch (error) {
    if(error.name === 'ValidationError') {
      res.status(422);
    }
    next(error);
  }
});

// delete
router.delete('/:id/items/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    await Item.findByIdAndDelete(id);
    res.json({status: 200, message: 'Deleted succesfully'});
  } catch (error) {
    next(error);
  }
});

// edit
router.put('/:id/items/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    await Item.findOne({
      _id: id,
    }, (error) => {
      if(error) next(error);
    });
    await Item.update({_id:id}, req.body);
    res.json({status: 200, message: 'Updated succesfully'})
  } catch (error) {
    next(error);
  }
});

module.exports = router;