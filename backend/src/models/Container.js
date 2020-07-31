const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const containerSchema = new Schema({
  name: {type: String, required: true, unique: true},
  color: String
}, {
  timestamps: true,
});

const Container = mongoose.model('Container', containerSchema);

module.exports = Container;