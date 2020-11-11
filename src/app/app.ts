import 'reflect-metadata'; // for decorator
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { vars, logger } from './config';
import errorMiddleware from './error.middleware';

import { useExpressServer, ExpressAppOption } from '@mildjs/core';
// import { Connection, createConnection, useContainer, Container } from 'typeorm-di';

class App {
  private app: express.Application;
  public port: string | number;
  public env: string;
  private expressAppOption: ExpressAppOption;

  constructor(option: ExpressAppOption) {
    this.app = express();
    this.env = vars.env;
    this.port = vars.port || 3000;
    if (this.env === "test") this.port = 3009;
    this.expressAppOption = option;
  }

  public async init() {
    this.initializeMiddlewares();

    useExpressServer(this.app, this.expressAppOption);

    this.initializeSwagger();
    this.initializeErrorHandling();
    this.listen();
    logger.info('The server is successfully started.');
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`🚀 App listening on the port ${this.port}`);
    });
  }

  public getHttpServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    if (this.env === "production") {
      this.app.use(hpp());
      this.app.use(helmet());
      this.app.use(morgan('combined'));
      this.app.use(cors({ origin: 'your.domain.com', credentials: true }));
    } else {
      this.app.use(morgan('dev'));
      this.app.use(cors({ origin: true, credentials: true }));
    }

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeSwagger() {

    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/docs/api', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

}

export default App;
