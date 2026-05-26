const express = require('express');
const router = express.Router();
const { Quiz, SignWord, SignVc } = require('../models');
const contentsController = require('../controllers/contentsController');


router.get('/quiz/:sourceType/:sourceId', async (req, res) => {
  const { sourceType, sourceId } = req.params;
  try {
    const quiz = await Quiz.findOne({
      where: { source_type: sourceType, source_id: sourceId }
    });
    if (!quiz) return res.status(404).json({ message: '퀴즈 없음' });

    let image = '';
    if (sourceType === 'sign_word') {
      const word = await SignWord.findByPk(sourceId);
      image = word?.image || '';
    } else if (sourceType === 'sign_vc') {
      const vc = await SignVc.findByPk(sourceId);
      image = vc?.image || '';
    }

    res.json({ ...quiz.toJSON(), image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});


router.get('/vc/:id', contentsController.getSignVcById);

router.get('/word/:id', contentsController.getSignWordById);

module.exports = router;
