require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');

const authRouter = require('./routes/authRoutes');
const appRouter = require('./routes/appRoutes');
const fetchRouter = require('./routes/fetchRoutes');
const profileRouter = require('./routes/profileRoutes');
const postRouter = require('./routes/postRoutes');
const commentRouter = require('./routes/commentRoutes');
const searchRouter = require('./routes/searchRoutes');

const { configCloudinary } = require('./configs/cloudinaryConfig');
configCloudinary();

const passport = require('./configs/passportConfig');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cookieParser());

const routers = [
  authRouter,
  appRouter,
  fetchRouter,
  profileRouter,
  postRouter,
  commentRouter,
  searchRouter,
];

routers.forEach((router) => {
  app.use('/api', router);
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'That username is already taken' });
  }
  const status = err.status || err.statusCode || 500;
  if (status >= 500) {
    console.error(err);
  }
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

if (require.main === module) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Listening on port ${PORT}!`);
  });
}

module.exports = app;
