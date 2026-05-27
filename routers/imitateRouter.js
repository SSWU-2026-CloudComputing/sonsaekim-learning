const express = require('express');
const router = express.Router();
const multer = require('multer');
const imitateController = require('../controllers/imitateController');
const upload = multer({ dest: 'uploads/' });

// 따라하기 선택 페이지
router.get('/select', imitateController.showImitateSelect);

// AI 예측
router.post('/predict', upload.single('image'), imitateController.handlePrediction);

// 따라하기 페이지
router.get('/:type/study', imitateController.showImitate);

// 모음 결과 확인 페이지
router.get('/:type/result', imitateController.showImitateResult);

// 따라하기 오답 확인 페이지
router.get('/:type/wrong', imitateController.showImitateWrong);

module.exports = router;