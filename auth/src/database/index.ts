import { createConnection, getConnection } from 'typeorm';

const connection = {
  async create() {
    console.log('Connected to Auth DB');

    return createConnection();
  },

  async close() {
    await getConnection().close();
  },

  async clear() {
    const dbConnection = getConnection();
    const entities = dbConnection.entityMetadatas;

    entities.forEach(async entity => {
      const repository = dbConnection.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    });
  },
};

export default connection;
