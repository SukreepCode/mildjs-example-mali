import 'reflect-metadata'; // for decorator
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { Controller, Route, RouteDecorator } from './router';
import errorMiddleware from './middlewares/error.middleware';

import vars from './config/vars';
import logger from './config/logger';
import { AuthController } from '../authentication/auth.controller';

import { createConnection } from "typeorm";
import { User } from '../users/users.entity';

class App {
  public app: express.Application;
  public port: (string | number);
  public isProduction: boolean;

  constructor(controllers: any[]) {
    this.app = express();
    this.port = vars.port || 3000;
    this.isProduction = vars.env === 'production' ? true : false;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeSwagger();
    this.initializeErrorHandling();
    this.initializeDatabase();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`🚀 App listening on the port ${this.port}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    if (this.isProduction) {
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
    const swaggerJSDoc = require('swagger-jsdoc');
    const swaggerUi = require('swagger-ui-express');

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

  private initializeControllers(controllers: any[]) {
    // Iterate over all our controllers and register our routes
    controllers.forEach(controller => {
      // This is our instantiated class
      const instance = new controller();
      logger.info(`Added controller: ${instance.constructor.name}`);

      // The prefix saved to our controller
      const prefix = Reflect.getMetadata('prefix', controller);
      // Our `routes` array containing all our routes for this controller
      const routes: Array<RouteDecorator> = Reflect.getMetadata('routes', controller);

      const callInstance = (route: RouteDecorator) => (req: express.Request, res: express.Response) => {
        instance[route.methodName](req, res);
      }

      // Iterate over all routes and register them to our express application 
      routes.forEach((route: RouteDecorator) => {

        if (route.hasOwnProperty("middleware")) {
          // Call the middleware
          this.app[route.requestMethod](prefix + route.path, route.middleware, callInstance(route));
        } else {
          this.app[route.requestMethod](prefix + route.path, callInstance(route));
        }
        logger.info(`Mapped route: [${route.requestMethod}] '${prefix}${route.path}'`);

      });

    });

  }

  private initializeDatabase() {
    createConnection({
      name: 'default',
      type: "sqlite",
      database: "./app.sqlite",
      synchronize: true,
      entities: [User]
    })
    .then(connection => {
      // here you can start to work with your entities
    }).catch(error => logger.error(error)
    );
  }

}

export default App;
