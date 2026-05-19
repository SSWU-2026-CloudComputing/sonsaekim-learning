const { Quiz, SignWord, SignVc, BookmarkWord, BookmarkVc } = require('../models');
const { Sequelize } = require('sequelize');
const axios = require('axios');
const { publish } = require('../src/events/publisher');


exports.getQuizList = async (type, userId) => {
    const { Op } = require('sequelize');
    const isPhoneme = type === 'phoneme';

    const quizList = await Quiz.findAll({
        where: {
        source_type: isPhoneme ? 'sign_vc' : 'sign_word',
        },
        order: Quiz.sequelize.random(),
        limit: 10,
    });

    const enrichedQuizList = await Promise.all(
        quizList.map(async (quiz) => {
        let image = '';
        let is_bookmarked = false;

        if (quiz.source_type === 'sign_word') {
            const word = await SignWord.findByPk(quiz.source_id);
            image = word?.image || '';
                if (userId) {
                    const bookmark = await BookmarkWord.findOne({
                        where: { user_id: userId, word_id: quiz.source_id }
                    });
                    is_bookmarked = !!bookmark;
                }
        } else if (quiz.source_type === 'sign_vc') {
            const vc = await SignVc.findByPk(quiz.source_id);
            image = vc?.image || '';
                if (userId) {
                    const bookmark = await BookmarkVc.findOne({
                        where: { user_id: userId, vc_id: quiz.source_id }
                    });
                    is_bookmarked = !!bookmark;
                }
        }

        return {
            ...quiz.toJSON(),
            image,
                is_bookmarked
        };
        })
    );

    return enrichedQuizList;
};

exports.saveQuizResults = async (userId, quizResults) => {
    await publish('quiz.submitted', {
        userId,
        quizResults
    });

    return true;
};

exports.getWrongAnswers = async (userId) => {
    const totalCount = 10;

    const wrongRes = await axios.get(`${PROGRESS_API_URL}/progress/wrong-answers`, {
        params: { userId },
    });

    const vcSourceIds = wrongRes.data.vcIds || [];
    const wordSourceIds = wrongRes.data.wordIds || [];

    const mixedWrongIds = [
        ...vcSourceIds.map(id => ({ source_type: 'sign_vc', source_id: id })),
        ...wordSourceIds.map(id => ({ source_type: 'sign_word', source_id: id })),
    ]
        .sort(() => Math.random() - 0.5)
        .slice(0, totalCount);

    const selectedVcIds = mixedWrongIds
        .filter(item => item.source_type === 'sign_vc')
        .map(item => item.source_id);

    const selectedWordIds = mixedWrongIds
        .filter(item => item.source_type === 'sign_word')
        .map(item => item.source_id);

    const vcQuizList = selectedVcIds.length
        ? await Quiz.findAll({
            where: {
            source_type: 'sign_vc',
            source_id: {
                [Sequelize.Op.in]: selectedVcIds,
            },
            },
            order: Quiz.sequelize.random(),
        })
        : [];

    const wordQuizList = selectedWordIds.length
        ? await Quiz.findAll({
            where: {
            source_type: 'sign_word',
            source_id: {
                [Sequelize.Op.in]: selectedWordIds,
            },
            },
            order: Quiz.sequelize.random(),
        })
        : [];

    const quizList = [...vcQuizList, ...wordQuizList].sort(() => Math.random() - 0.5);

    const enrichedQuizList = await Promise.all(
        quizList.map(async (quiz) => {
        let image = '';
        let is_bookmarked = false;

        if (quiz.source_type === 'sign_word') {
            const word = await SignWord.findByPk(quiz.source_id);
            image = word?.image || '';

            if (userId) {
            const bookmark = await BookmarkWord.findOne({
                where: { user_id: userId, word_id: quiz.source_id },
            });
            is_bookmarked = !!bookmark;
            }
        } else if (quiz.source_type === 'sign_vc') {
            const vc = await SignVc.findByPk(quiz.source_id);
            image = vc?.image || '';

            if (userId) {
            const bookmark = await BookmarkVc.findOne({
                where: { user_id: userId, vc_id: quiz.source_id },
            });
            is_bookmarked = !!bookmark;
            }
        }

        return {
            ...quiz.toJSON(),
            image,
            is_bookmarked,
        };
        })
    );

    return enrichedQuizList;
};

exports.toggleBookmark = async (userId, sourceType, sourceId) => {
    if (sourceType === 'sign_word') {
        const existing = await BookmarkWord.findOne({ where: { user_id: userId, word_id: sourceId } });

        if (existing) {
        await BookmarkWord.destroy({ where: { user_id: userId, word_id: sourceId } });
        return 'removed';
        } else {
        await BookmarkWord.create({ user_id: userId, word_id: sourceId });
        return 'added';
        }
    } else if (sourceType === 'sign_vc') {
        const existing = await BookmarkVc.findOne({ where: { user_id: userId, vc_id: sourceId } });

        if (existing) {
        await BookmarkVc.destroy({ where: { user_id: userId, vc_id: sourceId } });
        return 'removed';
        } else {
        await BookmarkVc.create({ user_id: userId, vc_id: sourceId });
        return 'added';
        }
    } else {
        throw new Error('유효하지 않은 sourceType입니다.');
    }

    
};