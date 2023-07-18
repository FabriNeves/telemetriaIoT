import mqtt from mqtt

function subscribeToTopic(device, password, username, port = 8883, url = 'mqtt://6370d52f38c74fd39be495f95d80c01c.s2.eu.hivemq.cloud') {
  // Configura as opções de conexão
  const options = {
    port: port,
    clientId: 'mqtt_' + Math.random().toString(16).substr(2, 8),
    username: username,
    password: password,
    protocol: 'mqtts',
  };

  // Cria um cliente MQTT
  const client = mqtt.connect(url, options);

  // Conecta ao servidor MQTT
  client.on('connect', () => {
    console.log('Conectado ao servidor MQTT');

    // Gera o tópico com base no dispositivo fornecido
    const topic = `tele/tasmota_${device}/SENSOR`;

    // Inscreve-se no tópico
    client.subscribe(topic, { qos: 0 }, (error) => {
      if (error) {
        console.error(`Erro ao se inscrever no tópico ${topic}: ${error}`);
      } else {
        console.log(`Inscrito no tópico ${topic}`);
      }
    });
  });

  // Manipula os erros de conexão
  client.on('error', (error) => {
    console.error('Erro ao conectar ao servidor MQTT:', error);
  });

  // Manipula as mensagens recebidas
  client.on('message', (topic, message) => {
    console.log(`Mensagem recebida no tópico ${topic}: ${message.toString()}`);
    // Faça o processamento necessário com a mensagem recebida
  });
}

// Exemplo de uso
const device = '3D6E1C';
const password = 'Demonstrativo';
const username = 'Demo1234567';
const port = 8883;
const url = 'mqtt://6370d52f38c74fd39be495f95d80c01c.s2.eu.hivemq.cloud';

subscribeToTopic(device, password, username, port, url);
