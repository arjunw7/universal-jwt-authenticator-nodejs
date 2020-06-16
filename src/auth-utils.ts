import { AuthOptions } from './interfaces';
import bcrypt from 'bcrypt-nodejs';
import express from "express";
import jwt from 'jsonwebtoken';

export const isValidPassword = (userPassword, actualPassword) : boolean => {
    return bcrypt.compareSync(userPassword, actualPassword);
}

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

export const getMongoUri = (authOptions: AuthOptions) : string =>  `mongodb://${authOptions.username}:${authOptions.password}@${authOptions.host}:${authOptions.port}/${authOptions.serviceName}`;

export const authenticateToken = (req : express.Request, res : express.Response, next : express.NextFunction) => {
    const authHeader : string = req.headers['authorization'];
    const token : string = authHeader && authHeader.split(' ')[1];
    if(token ==  null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(401);
        req['user'] = user;
        next();
    })
}
