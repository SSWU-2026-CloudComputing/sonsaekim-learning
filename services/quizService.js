require('dotenv').config();

const { Quiz, SignWord, SignVc } = require('../models');
const { Sequelize } = require('sequelize');
const { publish } = require('../src/events/publisher');
const progressClient = require('../lib/progressClient');

exports.getQuizList = async (type, userId) => {
  const isPhoneme = type === 'phoneme';

  const quizList = await Quiz.findAll({
    where: {
      source_type: isPhoneme ? 'sign_vc' : 'sign_word',
    },
    order: Quiz.sequelize.random(),
    limit: 10,
  });

  let bookmarkedIds = [];

  if (userId) {
    const progressSourceType = isPhoneme
      ? 'sign_vc'
      : 'sign_word';

    const bookmarks = await progressClient.getBookmarks(
      userId,
      progressSourceType
    );

    const idKey = isPhoneme ? 'vc_id' : 'word_id';

    bookmarkedIds = Array.isArray(bookmarks)
      ? bookmarks.map((b) => Number(b[idKey]))
      : [];
  }

  const enrichedQuizList = await Promise.all(
    quizList.map(async (quiz) => {
      let image = '';

      if (quiz.source_type === 'sign_word') {
        const word = await SignWord.findByPk(quiz.source_id);
        image = word?.image || '';
      } else if (quiz.source_type === 'sign_vc') {
        const vc = await SignVc.findByPk(quiz.source_id);
        image = vc?.image || '';
      }

      return {
        ...quiz.toJSON(),
        image,
        is_bookmarked: bookmarkedIds.includes(
          Number(quiz.source_id)
        ),
      };
    })
  );

  return enrichedQuizList;
};

exports.saveQuizResults = async (userId, quizResults) => {
  await publish('quiz.submitted', {
    userId,
    quizResults,
  });

  return true;
};

exports.getWrongAnswers = async (userId) => {
  const totalCount = 10;

  const wrongData = await progressClient.getWrongAnswers(userId);

  const vcSourceIds = wrongData.vcIds || [];
  const wordSourceIds = wrongData.wordIds || [];

  const mixedWrongIds = [
    ...vcSourceIds.map((id) => ({
      source_type: 'sign_vc',
      source_id: id,
    })),
    ...wordSourceIds.map((id) => ({
      source_type: 'sign_word',
      source_id: id,
    })),
  ]
    .sort(() => Math.random() - 0.5)
    .slice(0, totalCount);

  const selectedVcIds = mixedWrongIds
    .filter((item) => item.source_type === 'sign_vc')
    .map((item) => item.source_id);

  const selectedWordIds = mixedWrongIds
    .filter((item) => item.source_type === 'sign_word')
    .map((item) => item.source_id);

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

  const quizList = [...vcQuizList, ...wordQuizList].sort(
    () => Math.random() - 0.5
  );

  let bookmarkedVcIds = [];
  let bookmarkedWordIds = [];

  if (userId) {
    const [vcBookmarks, wordBookmarks] = await Promise.all([
      progressClient.getBookmarks(userId, 'sign_vc'),
      progressClient.getBookmarks(userId, 'sign_word'),
    ]);

    bookmarkedVcIds = Array.isArray(vcBookmarks)
      ? vcBookmarks.map((b) => Number(b.vc_id))
      : [];

    bookmarkedWordIds = Array.isArray(wordBookmarks)
      ? wordBookmarks.map((b) => Number(b.word_id))
      : [];
  }

  const enrichedQuizList = await Promise.all(
    quizList.map(async (quiz) => {
      let image = '';

      if (quiz.source_type === 'sign_word') {
        const word = await SignWord.findByPk(quiz.source_id);
        image = word?.image || '';
      } else if (quiz.source_type === 'sign_vc') {
        const vc = await SignVc.findByPk(quiz.source_id);
        image = vc?.image || '';
      }

      const is_bookmarked =
        quiz.source_type === 'sign_word'
          ? bookmarkedWordIds.includes(Number(quiz.source_id))
          : bookmarkedVcIds.includes(Number(quiz.source_id));

      return {
        ...quiz.toJSON(),
        image,
        is_bookmarked,
      };
    })
  );

  return enrichedQuizList;
};

exports.toggleBookmark = async (
  userId,
  sourceType,
  sourceId
) => {
  return await progressClient.toggleBookmark(
    userId,
    sourceType,
    sourceId
  );
};