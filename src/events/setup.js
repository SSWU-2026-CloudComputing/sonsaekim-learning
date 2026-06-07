const amqplib = require('amqplib');

async function setupQueues() {
    const connection = await amqplib.connect(
        process.env.RABBITMQ_URL || 'amqp://localhost'
    );
    const channel = await connection.createChannel();

    const exchange = 'learning.events';

    await channel.assertExchange(exchange, 'topic', { durable: true });

    console.log('Learning Exchange 설정 완료');

    await channel.close();
    await connection.close();
}

module.exports = { setupQueues };