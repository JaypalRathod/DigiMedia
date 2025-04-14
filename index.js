import express from 'express';
import dotenv from 'dotenv';
import dbConnection from './src/service/Database.js';
import App from './src/service/ExpressApp.js';
import admin from "firebase-admin";
import { createRequire } from 'module';
import { initSocket } from './socket.js';
import http from 'http';
import { rateLimit } from 'express-rate-limit'

const require = createRequire(import.meta.url);

dotenv.config();

const StartServer = async () => {

  const app = express();
  const PORT = process.env.PORT || 5000;

  const serviceAccount = require('./firebase/friendzy_firebase.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  const limiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  })

  app.use(limiter)

  await dbConnection();

  await App(app);

  const server = http.createServer(app);

  initSocket(server);

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

StartServer();