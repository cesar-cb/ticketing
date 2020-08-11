module.exports = {
  type: 'postgres',
  host: 'tickets-postgres-srv',
  port: 5432,
  username: 'postgresadmin',
  password: 'admin123',
  database: 'tickets',
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
};
