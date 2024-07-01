import cors from 'cors';
import express, {Express} from 'express';
import helmet from 'helmet';
import {pino} from 'pino';

const logger = pino({name: 'server started (by pino)'});
const app:Express = express();

app.set('trust proxy',true);
app.use(helmet());

// app.use('/attendee',attendeeRouter);


export {app, logger};