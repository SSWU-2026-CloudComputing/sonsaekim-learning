const amqplib = require('amqplib');

async function setupQueues() {
    const connection = await amqplib.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    const channel = await connection.createChannel();

    const exchange = 'learning.events';
    await channel.assertExchange(exchange, 'topic', { durable: true });

    const queues = [
        { name: 'quiz.submitted.queue', routingKey: 'QuizSubmitted' },
        { name: 'game.played.queue', routingKey: 'GamePlayed' },
        { name: 'inference.completed.queue', routingKey: 'InferenceCompleted' }, //없어서 추가했어용
    ];

    for (const q of queues) {
        await channel.assertQueue(q.name, { durable: true });
        await channel.bindQueue(q.name, exchange, q.routingKey);
        console.log(`Queue [${q.name}] ← ${q.routingKey} 바인딩 완료`);
    }

    console.log('모든 Queue 설정 완료');
}

module.exports = { setupQueues };
