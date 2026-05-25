const axios = require('axios');

const PROGRESS_URL = process.env.PROGRESS_SERVICE_URL || 'http://progress-service:3002';

exports.getBookmarks = async (userId, sourceType) => {
  const res = await axios.get(`${PROGRESS_URL}/progress/bookmarks`, {
    params: { userId, sourceType }
  });
  return res.data.status;
};

exports.toggleBookmark = async (userId, sourceType, sourceId) => {
  const res = await axios.post(`${PROGRESS_URL}/progress/bookmarks/toggle`, {
    userId, sourceType, sourceId
  });
  return res.data.status;
};

exports.getWrongAnswers = async (userId) => {
  const res = await axios.get(`${PROGRESS_URL}/progress/wrong-answers`, {
    params: { userId }
  });
  return res.data;
};

exports.getTop3 = async () => {
  const res = await axios.get(`${PROGRESS_URL}/progress/ranking/top3`);
  return res.data;
};

exports.getAllRecords = async () => {
  const res = await axios.get(`${PROGRESS_URL}/progress/ranking/all`);
  return res.data;
};

exports.getBestScore = async (userId) => {
  const res = await axios.get(`${PROGRESS_URL}/progress/score/best`, {
    params: { userId }
  });
  return res.data;
};