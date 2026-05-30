import amqp, { ChannelModel, Channel } from 'amqplib';

let connection: ChannelModel | null = null;
let channel:    Channel      | null = null;

export async function connectRabbitMQ(): Promise<void> {
  try {
    connection = await amqp.connect(
      process.env.RABBITMQ_URL || 'amqp://localhost:5672'
    );

    channel = await connection.createChannel();

    // Declare all queues this service will publish to
    await channel.assertQueue('schedule.changed', { durable: true });
    await channel.assertQueue('schedule.created', { durable: true });
    await channel.assertQueue('schedule.deleted', { durable: true });

    // Handle unexpected connection drops
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
    // Service continues without RabbitMQ in dev mode
  }
}

export async function publishScheduleEvent(
  queue:   string,
  payload: object
): Promise<void> {
  if (channel === null) {
    console.warn(
      `RabbitMQ channel not available — skipping event: ${queue}`
    );
    return;
  }

  // channel is guaranteed non-null here
  const ch = channel;
  ch.sendToQueue(
    queue,
    Buffer.from(JSON.stringify(payload)),
    { persistent: true }
  );

  console.log(`Event published to ${queue}:`, payload);
}