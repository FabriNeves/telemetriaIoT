import mongoose from 'mongoose';

const TelemetrySchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  ACStatus: {
    type: Boolean,
    required: true,
  },
  BatteryLoad: {
    type: Number,
    required: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  humidity: {
    type: Number,
    required: true,
  },
  GMGStatus: {
    type: Boolean,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Telemetry = mongoose.model('Telemetry', TelemetrySchema);


export default  Telemetry;







