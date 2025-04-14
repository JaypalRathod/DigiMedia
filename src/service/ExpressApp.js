import express from 'express';

import { UserRoute } from '../routes/UserRoute.js';
import { CommonRoute } from '../routes/CommonRoutes.js';
import { ProductRoute } from '../routes/ProductRoutes.js';
import { SellerRoute } from '../routes/SellerRoutes.js';
import { PostRoute } from '../routes/PostRoutes.js';
import { NotificationRoute } from '../routes/NotificationRoutes.js';


export default async (app) => {

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }))

    app.use(express.json());

    app.use('/user', UserRoute);
    app.use('/common', CommonRoute);
    app.use('/product', ProductRoute);
    app.use('/seller', SellerRoute);
    app.use('/post', PostRoute);
    app.use('/notification', NotificationRoute);

    return app;

}

