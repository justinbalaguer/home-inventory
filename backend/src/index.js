const express = require('express');
const app = express();
const mongoose = require('mongoose'); /* mongoose */
const cors = require('cors'); /* cors */
const morgan = require('morgan'); /* logging */
const helmet = require('helmet'); /* basic protection */
const {notFound, errorHandler} = require('./middlewares'); /* error handlers */

/* routes */
const containers = require('./api/containers');
const items = require('./api/items');

require('dotenv').config();

app.use(cors());
app.use(morgan('common'));
app.use(helmet());
app.use(express.json());

/* mongoose */
mongoose.set('useCreateIndex', true)
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});

app.get('/', (req, res) => {
  res.json({
    status: res.statusCode,
    message: '🥞'
  })
})

app.use('/api/containers', containers);
app.use('/api/items', items);

/* error handler */
app.use(notFound);
app.use(errorHandler);

/* start server */
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})