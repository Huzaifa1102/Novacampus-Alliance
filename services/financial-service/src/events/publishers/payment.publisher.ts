import amqp, { ChannelModel, Channel } from 'amqplib';

let connection: ChannelModel | null = null;
let channel:    Channel      | null = null;

export async function connectRabbitMQ(): Promise<void> {
  try {
    connection = await amqp.connect(
      process.env.RABBITMQ_URL || 'amqp://localhost:5672'
    );

    channel = await connection.createChannel();

    await channel.assertQueue('payment.reminder',  { durable: true });
    await channel.assertQueue('payment.overdue',   { durable: true });
    await channel.assertQueue('payment.confirmed', { durable: true });

    connection.on('error', (err: Error) => {
      console.warn('RabbitMQ connection error:', err.message);
      connection = null;
      channel    = null;
    });

    console.log('Connected to RabbitMQ');
  } catch (err) {
    console.warn(
      'RabbitMQ not available — running without event publishing:',
      (err as Error).message
    );
  }
}

export async function publishPaymentEvent(
  queue:   string,
  payload: object
): Promise<void> {
  if (channel === null) {
    console.warn(`RabbitMQ not available — skipping event: ${queue}`);
    return;
  }
  const ch = channel;
  ch.sendToQueue(
    queue,
    Buffer.from(JSON.stringify(payload)),
    { persistent: true }
  );
  console.log(`Event published to ${queue}:`, payload);
}