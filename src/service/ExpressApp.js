import express from 'express';

import { UserRoute } from '../routes/UserRoute.js';


export default async (app) => {

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }))

    app.use(express.json());

    app.use('/user', UserRoute)

    return app;

}

