import Telemetry from "../models/MqttData.js";

class TelemetryController {
    static async getTelemetry(req, res) {
        //console.log(req.body);
        try {
            const { limit, topic } = req.body;
            console.log(topic, limit);
            const telemetryData = await Telemetry.find({ topic })
                .sort({ timestamp: -1 })
                .limit(limit);

            res.json(telemetryData);
        } catch (error) {
            res.status(500).json({ error: "Erro ao obter os dados de Telemetria" });
        }
    }
}

export default TelemetryController;
