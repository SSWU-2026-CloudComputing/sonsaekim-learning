const { SignVc, VcWrong, WordWrong } = require('../models');
const { Op } = require('sequelize');

const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const path = require('path');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL;

async function getImitateList(type) {
  const imitateList = await SignVc.findAll({
    where: type === 'vowel'
        ? { vc_id: { [Op.gt]: 14 } }
        : { vc_id: { [Op.lte]: 14 } },

    order: SignVc.sequelize.random(),
    limit: 10,
  });

  return imitateList.map((item) => ({
    ...item.toJSON(),
    image: item.image || '',
    source_type: 'sign_vc',
  }));
}

async function runPrediction(imagePath, correctText, mode) {
  const formData = new FormData();

  formData.append(
    'image',
    fs.createReadStream(imagePath),
    {
      filename: path.basename(imagePath),
      contentType: 'image/jpeg',
    }
  );

  formData.append('correctText', correctText);
  formData.append('mode', mode);

  const response = await axios.post(
    `${AI_SERVICE_URL}/predict`,
    formData,
    {
      headers: formData.getHeaders(),
    }
  );

  console.log('AI 응답:', response.data);

  return response.data;
}

async function saveImitateResults(userId, imitateResults) {
  if (!userId) {
    throw new Error('로그인이 필요합니다.');
  }

  for (const result of imitateResults) {
    const common = {
      is_follow: result.is_follow ?? true,
      is_relearned: result.is_relearned ?? null,
      selected: null,
      option1: null,
      option2: null,
      option3: null,
      option4: null,
      answer: result.answer,
      created_at: new Date(),
    };

    if (
      result.source_type === 'vowel' ||
      result.source_type === 'consonant'
    ) {
      const where = {
        user_id: userId,
        word_id: result.source_id,
      };

      const existing = await WordWrong.findOne({ where });

      if (existing) {
        await WordWrong.update(common, { where });
      } else {
        await WordWrong.create({
          user_id: userId,
          word_id: result.source_id,
          ...common,
        });
      }
    }
  }
}

module.exports = {
  getImitateList,
  runPrediction,
  saveImitateResults,
};