import JSONdb from 'simple-json-db';
import * as path from 'path';

const initDatabase = () => {
  const db = new JSONdb(path.join(__dirname, '../data.json'));
  db.sync();
  return db;
};

export default initDatabase();
