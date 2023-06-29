import mongoose from "mongoose";

const connectionString = "mongodb://127.0.0.1:27017/telemetria-IoT"
mongoose.connect(connectionString);
let db = mongoose.connection;

export default db;