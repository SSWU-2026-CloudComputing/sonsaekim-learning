require('dotenv').config();

const { SignWord, SignVc, sequelize } = require('../models');
const axios = require('axios');
const { publish } = require('../src/events/publisher');

const PROGRESS_API_URL = process.env.PROGRESS_API_URL;

exports.getRandomImages = async () => {
  const words = await SignWord.findAll({
    order: sequelize.random(),
    limit: 5,
  });

  const vcs = await SignVc.findAll({
    order: sequelize.random(),
    limit: 5,
  });

  return [
    ...words.map(word => ({
      image: word.image,
      value: word.description,
      type: 'word',
    })),
    ...vcs.map(vc => ({
      image: vc.image,
      value: vc.description,
      type: 'vc',
    })),
  ];
};

exports.getTop3Records = async () => {
  const res = await axios.get(`${PROGRESS_API_URL}/progress/ranking/top3`);
  return res.data;
};

exports.createRecord = async (userId, score, userName) => {
  await publish('game.played', {
    userId,
    userName,
    score,
    playedAt: new Date().toISOString(),
  });

  return { userId, userName, score };
};

exports.getUserTopScore = async (userId) => {
  const res = await axios.get(`${PROGRESS_API_URL}/progress/score/best`, {
    params: { userId },
  });

  return res.data.score || 0;
};