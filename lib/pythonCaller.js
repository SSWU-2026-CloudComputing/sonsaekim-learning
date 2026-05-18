const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const path = require('path');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:5001';

exports.Prediction = async (imagePath) => {
  const formData = new FormData();
  const fileStream = fs.createReadStream(imagePath);

  formData.append('image', fileStream, {
    filename: path.basename(imagePath),
    contentType: 'image/jpeg',
  });

  try {
    const response = await axios.post(`${AI_SERVICE_URL}/predict`, formData, {
      headers: formData.getHeaders(),
    });
    console.log("AI 응답:", response.data);
    return response.data;
  } catch (err) {
    console.error("AI 호출 실패:", err);
    throw err;
  }
};