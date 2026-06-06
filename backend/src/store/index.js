const fs = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");

const DATA_DIR = path.join(__dirname, "../../data");
const COLLECTIONS = ["users", "courses", "lessons", "progress", "activities"];

const ensureDir = async () => {
  await fs.mkdir(DATA_DIR, { recursive: true });
};

const collectionPath = (name) => path.join(DATA_DIR, `${name}.json`);

const readCollection = async (name) => {
  await ensureDir();
  try {
    const raw = await fs.readFile(collectionPath(name), "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(collectionPath(name), "[]", "utf8");
      return [];
    }
    throw error;
  }
};

const writeCollection = async (name, items) => {
  await ensureDir();
  await fs.writeFile(collectionPath(name), JSON.stringify(items, null, 2), "utf8");
};

const resetStore = async (seed = {}) => {
  await ensureDir();
  for (const name of COLLECTIONS) {
    await writeCollection(name, Array.isArray(seed[name]) ? seed[name] : []);
  }
};

const makeId = () => randomUUID();

const stamp = (record) => ({
  _id: record._id || makeId(),
  createdAt: record.createdAt || new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...record
});

const createRecord = async (name, record) => {
  const items = await readCollection(name);
  const doc = stamp(record);
  items.push(doc);
  await writeCollection(name, items);
  return doc;
};

const insertMany = async (name, records) => {
  const items = await readCollection(name);
  const docs = records.map(stamp);
  items.push(...docs);
  await writeCollection(name, items);
  return docs;
};

const findMany = async (name, predicate = () => true) => {
  const items = await readCollection(name);
  return items.filter(predicate);
};

const findOne = async (name, predicate = () => true) => {
  const items = await readCollection(name);
  return items.find(predicate) || null;
};

const findById = async (name, id) => findOne(name, (item) => String(item._id) === String(id));

const countDocuments = async (name, predicate = () => true) => {
  const items = await readCollection(name);
  return items.filter(predicate).length;
};

const deleteMany = async (name, predicate = () => true) => {
  const items = await readCollection(name);
  const remaining = items.filter((item) => !predicate(item));
  await writeCollection(name, remaining);
  return { deletedCount: items.length - remaining.length };
};

const upsertOne = async (name, predicate, record) => {
  const items = await readCollection(name);
  const index = items.findIndex(predicate);

  if (index === -1) {
    const created = stamp(record);
    items.push(created);
    await writeCollection(name, items);
    return created;
  }

  items[index] = stamp({ ...items[index], ...record, _id: items[index]._id, createdAt: items[index].createdAt });
  await writeCollection(name, items);
  return items[index];
};

module.exports = {
  COLLECTIONS,
  resetStore,
  createRecord,
  insertMany,
  findMany,
  findOne,
  findById,
  countDocuments,
  deleteMany,
  upsertOne,
  readCollection,
  writeCollection,
  makeId
};