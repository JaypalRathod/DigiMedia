import express from 'express';

import { UserRoute } from '../routes/UserRoute.js';
import { CommonRoute } from '../routes/CommonRoutes.js';


export default async (app) => {

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }))

    app.use(express.json());

    app.use('/user', UserRoute);
    app.use('/common', CommonRoute);

    return app;

}

