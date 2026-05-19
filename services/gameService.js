const { GameRecord, User, SignWord, SignVc, sequelize } = require('../models');
const { publish } = require('../src/events/publisher');

exports.getRandomImages = async () => {
  const wordSamples = await SignWord.findAll({
    order: sequelize.random(),
    limit: 5
  });

  const vcSamples = await SignVc.findAll({
    order: sequelize.random(),
    limit: 5
  });

  return [...wordSamples, ...vcSamples].map((item) => ({
    image: item.image,
    value: item.description
  }));
};

exports.getTop3Records = async () => {
  return await GameRecord.findAll({
    order: [['score', 'DESC']],
    limit: 3
    });
};

exports.createRecord = async (userId, score) => {
  const record = await GameRecord.create({ user_id: userId, score });

  await publish('GamePlayed', {
      userId,
      gameRecordId: record.game_record_id,
      score,
      playedAt: new Date().toISOString()
  });

  return record;
};

exports.getAllRecords = async () => {
  return await GameRecord.findAll();
};

exports.getUserTopScore = async (userId) => {
  return await GameRecord.max('score', { where: { user_id: userId } });
};
