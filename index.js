import express from 'express';
import dotenv from 'dotenv';
import dbConnection from './src/service/Database.js';
import App from './src/service/ExpressApp.js';

dotenv.config();

const StartServer = async () => {

  const app = express();
  const PORT = process.env.PORT || 5000;

  await dbConnection();

  await App(app);

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

StartServer();