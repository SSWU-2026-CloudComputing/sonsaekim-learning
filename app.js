const express = require('express');
require('dotenv').config();
const db = require('./models');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { RedisStore } = require('connect-redis');
const { createClient } = require('redis');
const { connectRabbitMQ } = require('./src/events/publisher');
const { setupQueues } = require('./src/events/setup');
const seed = require('./seed/seed');

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || 6379,
  },
});

redisClient.connect().catch(console.error);

app.use(cookieParser(process.env.SESSION_SECRET));

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || 'mySecretKey',
    resave: false,
    saveUninitialized: false,
    name: 'connect.sid',
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60,
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
app.use('/api', imitateRouter);

const learnRouter = require('./routers/learnRouter');
app.use('/learn', learnRouter);

const gameRouter = require('./routers/gameRouter');
app.use('/game', gameRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

db.sequelize.sync()
  .then(async () => {
    console.log('Learning DB 연결 완료');

    await seed();
    await connectRabbitMQ();
    await setupQueues();

    app.listen(app.get('port'), '0.0.0.0', () => {
      console.log(`Learning Service running on port ${app.get('port')}`);
    });
  })
  .catch(err => {
    console.error('DB 연결 실패:', err);
  });