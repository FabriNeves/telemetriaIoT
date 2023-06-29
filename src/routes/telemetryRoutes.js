import express from "express";
import TelemetryController from "../controllers/TelemetryController.js";


const telemetryRouter = express.Router();


telemetryRouter.route(`/telemetry`)  
    .post(TelemetryController.getTelemetry);


export default telemetryRouter;