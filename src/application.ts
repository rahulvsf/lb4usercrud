import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {AuthenticationComponent, Strategies} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import path from 'path';
import {LoggerComponent} from './components/logger';
import {jwtMiddleware} from './middleware/jwtheader';
import {BearerTokenVerifierProvider} from './providers/BearerToken';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class UserappApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  // REVIEW:
  /**
   *
   * 1. LB4 simple crud with in-memory connector:
   * datasources/db.datasource.ts
   * data/db.json
   * controllers/user.controller.js
   *
   * 2. Customize boot options to load from different path
   * bootercontrollers/*
   * modified: this.bootOptions in application.ts
   *
   * 3. .env file with ALLOWED_ORIGIN added
   * added a check in sequence.ts to check origin
   *
   * 4. Logging with winston
   * created a new component: components/logger
   * with: types, keys, provider and component file
   * added to sequence to log at console + 2 diff .log files
   *
   * 5. Postgres Database connector for Roles & Customers
   * datasources/postgres.datasource.ts
   *
   * 6. Relation between users, roles and customers
   * hasOne() relation in --> models/user.model.ts
   *
   * 7. Simple REST Connector --> https://github.com/rahulvsf/crudconnectors
   *
   * 8. JWT middleware
   * gets cookie, added auth header to request
   * middleware/jwtheader.ts
   *
   * 9. Authentication package
   * authenticate requests with JWT Bearer Strategy
   * providers/BearerToken.ts
   *
   * 10. Authorisation, Soft Delete
   * Emulate permissions recieved in the jwt header
   * @authorisation decorator on testing routes
   * Soft delete on models/user.model.ts
   *
   */
  //
  //

  constructor(options: ApplicationConfig = {}) {
    super(options);
    // confirgure middleware
    this.middleware(jwtMiddleware);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    // initialize custom winston logger component
    this.component(LoggerComponent);
    // initialize Auth component from loopback
    this.component(AuthenticationComponent);

    this.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer'],
    });
    this.component(AuthorizationComponent);

    this.bind(Strategies.Passport.BEARER_TOKEN_VERIFIER).toProvider(
      BearerTokenVerifierProvider,
    );

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // added bootercontrollers
        // to load from different directory
        dirs: ['controllers', 'bootercontrollers'],
        extensions: ['.controller.js', '.booter.js'],
        nested: true,
      },
    };
  }
}
