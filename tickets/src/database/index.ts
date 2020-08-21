import { createConnection, getConnection, getConnectionOptions } from 'typeorm';

const connection = {
  async create() {
    const optionName = process.env.NODE_ENV === 'test' ? 'test' : 'default';

    const options = await getConnectionOptions(optionName);

    console.log('Connected to Tickets DB');

    return createConnection({ ...options, name: 'default' });
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
