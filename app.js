const express = require('express');
require('dotenv').config();
const db = require('./models');
const path = require('path');
const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.locals.user = req.headers['x-user-id'] || 1; // 테스트용 1번 유저
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

const predictRouter = require('./routers/predictRouter');
app.use('/api', predictRouter);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

db.sequelize.sync()
  .then(() => {
    console.log('Learning DB 연결 완료');
    app.listen(app.get('port'), '0.0.0.0', () => {
      console.log(`Learning Service running on port ${app.get('port')}`);
    });
  })
  .catch(err => {
    console.error('DB 연결 실패:', err);
  });
