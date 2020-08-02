const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const containerSchema = new Schema({
  name: {type: String, required: true, unique: true},
  description: String
}, {
  timestamps: true,
});

const Container = mongoose.model('Container', containerSchema);

module.exports = Container;