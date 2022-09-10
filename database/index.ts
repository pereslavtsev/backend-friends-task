import db from './initDatabase';
import BaseEntity from './entities/BaseEntity';

class Database<T extends typeof BaseEntity = typeof BaseEntity> {
  key: string;
  lastID: number;
  entityClass: T;

  constructor(key: string, entityClass: T) {
    this.key = key;
    this.entityClass = entityClass;

    const items = db.get(this.key);
    if (Array.isArray(items) && items.length > 0) {
      this.lastID = items[items.length - 1].id;
    } else {
      this.lastID = 0;
      db.set(this.key, []);
    }
  }

  getAll = (): Array<T['prototype']> => {
    return db.get(this.key) as Array<T['prototype']>;
  };

  get = (id: number): T['prototype'] | undefined => {
    const items = db.get(this.key) as Array<T['prototype']>;
    console.log('items: ', items);
    return items.find((item) => item.id === id);
  };

  add = (obj: Omit<T['prototype'], 'id'>) => {
    const items = db.get(this.key);
    this.lastID += 1;
    db.set(this.key, [...items, { ...obj, id: this.lastID }]);
    db.sync();
  };

  update = (id: number, obj: T['prototype']) => {
    const objects = db.get(this.key) as Array<T['prototype']>;
    const updateIndex = objects.findIndex((item) => item.id === id);
    if (updateIndex === -1) return;
    db.set(this.key, [
      ...objects.slice(0, updateIndex),
      { ...obj, id },
      ...objects.slice(updateIndex + 1),
    ]);
    db.sync();
  };

  delete = (id: number) => {
    const objects = db.get(this.key) as Array<T['prototype']>;
    const updateIndex = objects.findIndex((item) => item.id === id);
    if (updateIndex === -1) return;
    db.set(this.key, [
      ...objects.slice(0, updateIndex),
      ...objects.slice(updateIndex + 1),
    ]);
    db.sync();
  };
}

export default Database;
