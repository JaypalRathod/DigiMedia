import express from 'express';
import dotenv from 'dotenv';
import dbConnection from './src/service/Database.js';
import App from './src/service/ExpressApp.js';
import admin from "firebase-admin";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

dotenv.config();

const StartServer = async () => {

  const app = express();
  const PORT = process.env.PORT || 5000;

  const serviceAccount = require('./firebase/friendzy_firebase.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });


  await dbConnection();

  await App(app);

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

StartServer();