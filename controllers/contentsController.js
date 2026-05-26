const { SignVc, SignWord } = require('../models');

exports.getSignVcById = async (req, res) => {
    try {
        const vc = await SignVc.findByPk(req.params.id);

        if (!vc) {
        return res.status(404).json({ message: '자음/모음 데이터를 찾을 수 없습니다.' });
        }

        res.json(vc);
    } catch (err) {
        console.error('getSignVcById 오류:', err);
        res.status(500).json({ message: '서버 오류' });
    }
};

exports.getSignWordById = async (req, res) => {
    try {
        const word = await SignWord.findByPk(req.params.id);

        if (!word) {
        return res.status(404).json({ message: '단어 데이터를 찾을 수 없습니다.' });
        }

        res.json(word);
    } catch (err) {
        console.error('getSignWordById 오류:', err);
        res.status(500).json({ message: '서버 오류' });
    }
};