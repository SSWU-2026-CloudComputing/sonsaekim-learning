const { SignVc, SignWord, Quiz } = require('../models');

async function seed() {
    try {
        const quizCount = await Quiz.count();

        if (quizCount > 0) {
            console.log('이미 seed 데이터 존재');
            return;
    }

    // sign_vc
    await SignVc.bulkCreate([
        { image: '/assets/sign_vc/수어_ㄱ.png', description: 'ㄱ' },
        { image: '/assets/sign_vc/수어_ㄴ.png', description: 'ㄴ' },
        { image: '/assets/sign_vc/수어_ㄷ.png', description: 'ㄷ' },
        { image: '/assets/sign_vc/수어_ㄹ.png', description: 'ㄹ' },
        { image: '/assets/sign_vc/수어_ㅁ.png', description: 'ㅁ' },
        { image: '/assets/sign_vc/수어_ㅂ.png', description: 'ㅂ' },
        { image: '/assets/sign_vc/수어_ㅅ.png', description: 'ㅅ' },
        { image: '/assets/sign_vc/수어_ㅇ.png', description: 'ㅇ' },
        { image: '/assets/sign_vc/수어_ㅈ.png', description: 'ㅈ' },
        { image: '/assets/sign_vc/수어_ㅊ.png', description: 'ㅊ' },
        { image: '/assets/sign_vc/수어_ㅋ.png', description: 'ㅋ' },
        { image: '/assets/sign_vc/수어_ㅌ.png', description: 'ㅌ' },
        { image: '/assets/sign_vc/수어_ㅍ.png', description: 'ㅍ' },
        { image: '/assets/sign_vc/수어_ㅎ.png', description: 'ㅎ' },
        { image: '/assets/sign_vc/수어_ㅏ.png', description: 'ㅏ' },
        { image: '/assets/sign_vc/수어_ㅐ.png', description: 'ㅐ' },
        { image: '/assets/sign_vc/수어_ㅑ.png', description: 'ㅑ' },
        { image: '/assets/sign_vc/수어_ㅒ.png', description: 'ㅒ' },
        { image: '/assets/sign_vc/수어_ㅓ.png', description: 'ㅓ' },
        { image: '/assets/sign_vc/수어_ㅔ.png', description: 'ㅔ' },
        { image: '/assets/sign_vc/수어_ㅕ.png', description: 'ㅕ' },
        { image: '/assets/sign_vc/수어_ㅖ.png', description: 'ㅖ' },
        { image: '/assets/sign_vc/수어_ㅗ.png', description: 'ㅗ' },
        { image: '/assets/sign_vc/수어_ㅚ.png', description: 'ㅚ' },
        { image: '/assets/sign_vc/수어_ㅛ.png', description: 'ㅛ' },
        { image: '/assets/sign_vc/수어_ㅜ.png', description: 'ㅜ' },
        { image: '/assets/sign_vc/수어_ㅟ.png', description: 'ㅟ' },
        { image: '/assets/sign_vc/수어_ㅠ.png', description: 'ㅠ' },
        { image: '/assets/sign_vc/수어_ㅡ.png', description: 'ㅡ' },
        { image: '/assets/sign_vc/수어_ㅢ.png', description: 'ㅢ' },
        { image: '/assets/sign_vc/수어_ㅣ.png', description: 'ㅣ' },
    ]);

    // sign_word
    await SignWord.bulkCreate([
        { image: '/assets/sign_word/개.jpg', description: '개' },
        { image: '/assets/sign_word/고양이.jpg', description: '고양이' },
        { image: '/assets/sign_word/드레스.jpg', description: '드레스' },
        { image: '/assets/sign_word/떡.jpg', description: '떡' },
        { image: '/assets/sign_word/무지개.jpg', description: '무지개' },
        { image: '/assets/sign_word/별.jpg', description: '별' },
        { image: '/assets/sign_word/빵.jpg', description: '빵' },
        { image: '/assets/sign_word/칫솔.jpg', description: '칫솔' },
        { image: '/assets/sign_word/맥주.jpg', description: '맥주' },
        { image: '/assets/sign_word/만화.jpg', description: '만화' },
    ]);

    // quiz
    await Quiz.bulkCreate([
        { option1: 'ㄱ', option2: 'ㄴ', option3: 'ㅋ', option4: 'ㄹ', answer: '1', source_id: 1, source_type: 'sign_vc' },
        { option1: 'ㄱ', option2: 'ㄴ', option3: 'ㄷ', option4: 'ㄹ', answer: '2', source_id: 2, source_type: 'sign_vc' },
        { option1: 'ㄱ', option2: 'ㄴ', option3: 'ㄷ', option4: 'ㄹ', answer: '3', source_id: 3, source_type: 'sign_vc' },
        { option1: 'ㄱ', option2: 'ㄴ', option3: 'ㅋ', option4: 'ㄹ', answer: '4', source_id: 4, source_type: 'sign_vc' },
        { option1: 'ㅁ', option2: 'ㅍ', option3: 'ㄹ', option4: 'ㅎ', answer: '1', source_id: 5, source_type: 'sign_vc' },
        { option1: 'ㅂ', option2: 'ㅈ', option3: 'ㅊ', option4: 'ㄹ', answer: '1', source_id: 6, source_type: 'sign_vc' },
        { option1: 'ㅅ', option2: 'ㅈ', option3: 'ㅊ', option4: 'ㅋ', answer: '1', source_id: 7, source_type: 'sign_vc' },
        { option1: 'ㅇ', option2: 'ㅎ', option3: 'ㅍ', option4: 'ㅁ', answer: '1', source_id: 8, source_type: 'sign_vc' },
        { option1: 'ㅈ', option2: 'ㅅ', option3: 'ㅊ', option4: 'ㅋ', answer: '1', source_id: 9, source_type: 'sign_vc' },
        { option1: 'ㅊ', option2: 'ㅅ', option3: 'ㅈ', option4: 'ㅋ', answer: '1', source_id: 10, source_type: 'sign_vc' },
        { option1: 'ㅋ', option2: 'ㅈ', option3: 'ㅌ', option4: 'ㅂ', answer: '1', source_id: 11, source_type: 'sign_vc' },
        { option1: 'ㅌ', option2: 'ㅊ', option3: 'ㅂ', option4: 'ㅍ', answer: '1', source_id: 12, source_type: 'sign_vc' },
        { option1: 'ㅍ', option2: 'ㅂ', option3: 'ㅁ', option4: 'ㅎ', answer: '1', source_id: 13, source_type: 'sign_vc' },
        { option1: 'ㅎ', option2: 'ㅇ', option3: 'ㅁ', option4: 'ㅂ', answer: '1', source_id: 14, source_type: 'sign_vc' },
        { option1: 'ㅏ', option2: 'ㅑ', option3: 'ㅓ', option4: 'ㅗ', answer: '1', source_id: 15, source_type: 'sign_vc' },
        { option1: 'ㅐ', option2: 'ㅔ', option3: 'ㅏ', option4: 'ㅒ', answer: '1', source_id: 16, source_type: 'sign_vc' },
        { option1: 'ㅑ', option2: 'ㅏ', option3: 'ㅕ', option4: 'ㅠ', answer: '1', source_id: 17, source_type: 'sign_vc' },
        { option1: 'ㅒ', option2: 'ㅐ', option3: 'ㅖ', option4: 'ㅔ', answer: '1', source_id: 18, source_type: 'sign_vc' },
        { option1: 'ㅓ', option2: 'ㅏ', option3: 'ㅗ', option4: 'ㅜ', answer: '1', source_id: 19, source_type: 'sign_vc' },
        { option1: 'ㅔ', option2: 'ㅐ', option3: 'ㅖ', option4: 'ㅟ', answer: '1', source_id: 20, source_type: 'sign_vc' },
        { option1: 'ㅕ', option2: 'ㅑ', option3: 'ㅛ', option4: 'ㅓ', answer: '1', source_id: 21, source_type: 'sign_vc' },
        { option1: 'ㅖ', option2: 'ㅒ', option3: 'ㅔ', option4: 'ㅟ', answer: '1', source_id: 22, source_type: 'sign_vc' },
        { option1: 'ㅗ', option2: 'ㅛ', option3: 'ㅓ', option4: 'ㅜ', answer: '1', source_id: 23, source_type: 'sign_vc' },
        { option1: 'ㅚ', option2: 'ㅙ', option3: 'ㅘ', option4: 'ㅗ', answer: '1', source_id: 24, source_type: 'sign_vc' },
        { option1: 'ㅛ', option2: 'ㅗ', option3: 'ㅠ', option4: 'ㅕ', answer: '1', source_id: 25, source_type: 'sign_vc' },
        { option1: 'ㅜ', option2: 'ㅠ', option3: 'ㅗ', option4: 'ㅡ', answer: '1', source_id: 26, source_type: 'sign_vc' },
        { option1: 'ㅟ', option2: 'ㅢ', option3: 'ㅜ', option4: 'ㅚ', answer: '1', source_id: 27, source_type: 'sign_vc' },
        { option1: 'ㅠ', option2: 'ㅛ', option3: 'ㅜ', option4: 'ㅣ', answer: '1', source_id: 28, source_type: 'sign_vc' },
        { option1: 'ㅡ', option2: 'ㅜ', option3: 'ㅣ', option4: 'ㅢ', answer: '1', source_id: 29, source_type: 'sign_vc' },
        { option1: 'ㅢ', option2: 'ㅟ', option3: 'ㅣ', option4: 'ㅡ', answer: '1', source_id: 30, source_type: 'sign_vc' },
        { option1: 'ㅣ', option2: 'ㅐ', option3: 'ㅔ', option4: 'ㅠ', answer: '1', source_id: 31, source_type: 'sign_vc' },

        { option1: '개', option2: '고양이', option3: '도깨비', option4: '토끼', answer: '1', source_id: 1, source_type: 'sign_word' },
        { option1: '고양이', option2: '개', option3: '도깨비', option4: '토끼', answer: '1', source_id: 2, source_type: 'sign_word' },
        { option1: '드레스', option2: '다리미', option3: '보자기', option4: '무지개', answer: '1', source_id: 3, source_type: 'sign_word' },
        { option1: '떡', option2: '빵', option3: '폭탄', option4: '화산', answer: '1', source_id: 4, source_type: 'sign_word' },
        { option1: '무지개', option2: '별', option3: '은하수', option4: '별똥별', answer: '1', source_id: 5, source_type: 'sign_word' },
        { option1: '별', option2: '어지럽다', option3: '새', option4: '구름', answer: '1', source_id: 6, source_type: 'sign_word' },
        { option1: '빵', option2: '떡', option3: '바구니', option4: '담다', answer: '1', source_id: 7, source_type: 'sign_word' },
        { option1: '칫솔', option2: '양치', option3: '치실', option4: '치약', answer: '1', source_id: 8, source_type: 'sign_word' },
        { option1: '맥주', option2: '인사', option3: '노래', option4: '컵', answer: '1', source_id: 9, source_type: 'sign_word' },
        { option1: '만화', option2: '종이', option3: '그림', option4: '연필', answer: '1', source_id: 10, source_type: 'sign_word' },
    ]);

        console.log('seed 완료');
    } catch (err) {
        console.error('seed 실패:', err);
    }
}

module.exports = seed;