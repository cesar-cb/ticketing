module.exports = [
  {
    name: 'default',
    type: 'postgres',
    host: 'payments-postgres-srv',
    port: 5432,
    username: 'postgresadmin',
    password: 'admin123',
    database: 'payments',
    synchronize: true,
    logging: false,
    entities: [`${__dirname}/src/models/**/*.ts`],
    migrations: [`${__dirname}/src/migration/**/*.ts`],
    subscribers: [`${__dirname}/src/subscriber/**/*.ts`],
    cli: {
      migrationsDir: [`${__dirname}/src/migrations/`],
      entitiesDir: `${__dirname}/src/models/`,
    },
  },
  {
    name: 'test',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
    synchronize: true,
    dropSchema: true,
    logging: false,
    entities: [`${__dirname}/src/models/**/*.ts`],
    migrations: [`${__dirname}/src/migration/**/*.ts`],
    subscribers: [`${__dirname}/src/subscriber/**/*.ts`],
    cli: {
      migrationsDir: [`${__dirname}/src/migrations/`],
      entitiesDir: `${__dirname}/src/models/`,
    },
  },
];
