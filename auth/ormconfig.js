module.exports = [
  {
    name: 'production',
    type: 'postgres',
    host: 'auth-postgres-srv',
    port: 5432,
    username: 'postgresadmin',
    password: 'admin123',
    database: 'auth',
    synchronize: true,
    logging: false,
    entities: [`${__dirname}src/models/**/*.ts`],
    migrations: ['src/migration/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    cli: {
      migrationsDir: ['src/migrations/'],
      entitiesDir: 'src/models/',
    },
  },
  {
    name: 'test',
    type: 'postgres',
    host: '10.100.156.24',
    port: 5432,
    username: 'postgresadmin',
    password: 'admin123',
    database: 'auth-test',
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