import express from "express";
import db from "./config/mongoConection.js";
import telemetryRouter from "./routes/telemetryRoutes.js";
import mqtt from 'mqtt';
import Telemetry from "./models/MqttData.js";
import dotenv from "dotenv";

dotenv.config();


const host = process.env.HOST;
const port = process.env.PORT;
const topic = process.env.TOPIC;
const username = process.env.USERNAME_MQTT;
const password = process.env.PASSWORD;


console.log(`
    Host:${host}
    Port:${port}
    topic:${topic}
    username:${username}
    password:${password}
`);


db.on("error", console.error.bind(console, "Erro de conexão..."));
db.once("open", () => console.log("Conexão com o banco de dados estabelecida."));

const app = express();
app.use(express.json());
app.use(telemetryRouter);

// Configurar as opções de conexão
const options = {
  host: host,
  port: port,
  protocol: 'mqtts', // Usar TLS
  username: username,
  password: password,
};

const client = mqtt.connect(options);
client.on('connect', () => {
  console.log('Conectado ao servidor MQTT');

  client.subscribe(topic, (error) => {
    if (error) {
      console.error(`Erro ao assinar o tópico ${topic}: ${error}`);
    } else {
      console.log(`Assinado no tópico ${topic}`);
    }
  });
});


client.on('message', (topic, message) => {
  if (topic) {
    const data = JSON.parse(message.toString());
    const switch1Value = (data.Switch1 === "ON") ? true : false;
    const switch2Value = (data.Switch2 === "ON") ? true : false;

    const analogValue = data.ANALOG.A0 ? data.ANALOG.A0 : 0;
    const temperatureValue = data.DHT11.Temperature ? data.DHT11.Temperature : 0;
    const humidityValue = data.DHT11.Humidity ? data.DHT11.Humidity : 0;


    console.log(`Valor Switch1: ${switch1Value}`);
    console.log(`Valor Switch2: ${switch2Value}`);
    console.log(`Valor ANALOG: ${analogValue}`);
    console.log(`Valor Temperature: ${temperatureValue}`);
    console.log(`Valor Humidity: ${humidityValue}`);

    const telemetryData = new Telemetry({
      topic: topic,
      ACStatus: switch1Value,
      GMGStatus: switch2Value,
      BatteryLoad: analogValue,
      temperature: temperatureValue,
      humidity: humidityValue    
    });

    telemetryData.save()
      .then(() => console.log('Dados de Telemetry salvos no banco de dados'))
      .catch((error) => console.error('Erro ao salvar dados de Telemetry:', error));
  }
});


export default app;
