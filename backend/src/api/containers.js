const {Router} = require('express');
const router = Router();

/* require model */
const Container = require('../models/Container');

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

module.exports = router;