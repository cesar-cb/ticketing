import { createConnection, getConnectionOptions, getConnection } from 'typeorm';

const connection = {
  async create() {
    const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
    return createConnection({ ...connectionOptions, name: 'default' });
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
