const express = require('express');
require('dotenv').config();
const db = require('./models');
const path = require('path');
const session = require('express-session');
const { RedisStore } = require('connect-redis');
const { createClient } = require('redis');
const { connectRabbitMQ } = require('./src/events/publisher');
const { setupQueues } = require('./src/events/setup');

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
});
redisClient.connect().catch(console.error);

app.use(
  session({
    store: new RedisStore({
      client: redisClient,
      prefix: 'sess:',
      ttl: 86400,
    }),
    secret: process.env.SESSION_SECRET || 'mySecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use('/', express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const quizRouter = require('./routers/quizRouter');
app.use('/quiz', quizRouter);

const imitateRouter = require('./routers/imitateRouter');
app.use('/imitate', imitateRouter);

const learnRouter = require('./routers/learnRouter');
app.use('/learn', learnRouter);

const gameRouter = require('./routers/gameRouter');
app.use('/game', gameRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

db.sequelize.sync()
  .then(async () => {
    console.log('Learning DB 연결 완료');

    await connectRabbitMQ();
    await setupQueues();

    app.listen(app.get('port'), '0.0.0.0', () => {
      console.log(`Learning Service running on port ${app.get('port')}`);
    });
  })
  .catch(err => {
    console.error('DB 연결 실패:', err);
  });
