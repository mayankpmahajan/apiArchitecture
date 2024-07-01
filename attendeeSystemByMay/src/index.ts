import { app, logger } from "./server";

const server = app.listen('3000', () => {
    logger.info('server is running on port 3000');
});

const onCloseSignal = () => {
    logger.info('sigint received, shutting down');

    server.close(()=>{
        logger.info('server closed');
        process.exit();
    });
    setTimeout(()=>process.exit(1),10000).unref();
};

process.on('SIGINT', onCloseSignal);
process.on('SIGTERM', onCloseSignal);