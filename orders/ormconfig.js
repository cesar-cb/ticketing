module.exports = [
  {
    name: 'default',
    type: 'postgres',
    host: 'orders-postgres-srv',
    port: 5432,
    username: 'postgresadmin',
    password: 'admin123',
    database: 'orders',
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
    host: '192.168.39.215',
    port: 31962,
    username: 'postgresadmin',
    password: 'admin123',
    database: 'tickets-test',
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