import pika
import pickle

# Connection parameters (adjust them based on your RabbitMQ setup)
rabbitmq_host = 'localhost'  # or 'your_rabbitmq_server'
queue_name = 'Logs'

# Establish a connection with RabbitMQ
connection = pika.BlockingConnection(pika.ConnectionParameters(host=rabbitmq_host))
channel = connection.channel()

# Ensure the queue exists (optional, depends on your use case)
channel.queue_declare(queue=queue_name)

# Callback function to print messages
def callback(ch, method, properties, body):
    data = pickle.loads(body)
    print(f"Received message: {data}")

# Subscribe to the queue and specify the callback function
channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)

print('Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
