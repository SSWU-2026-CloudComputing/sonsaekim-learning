const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../configs/config.js')[env];

const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const DataTypes = Sequelize.DataTypes;

db.Quiz = require('./quiz/quiz')(sequelize, DataTypes);
db.BookmarkWord = require('./quiz/bookmarkWord')(sequelize, DataTypes);
db.BookmarkVc = require('./quiz/bookmarkVc')(sequelize, DataTypes);
db.SignWord = require('./quiz/signWord')(sequelize, DataTypes);
db.SignVc = require('./quiz/signVc')(sequelize, DataTypes);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
