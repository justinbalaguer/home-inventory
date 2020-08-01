const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  container_id: {type: String, required: true},
  name: {type: String, required: true},
  description: String
}, {
  timestamps: true,
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;