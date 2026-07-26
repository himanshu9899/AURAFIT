const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let isMongoConnected = false;

class SimpleFileStore {
  constructor(collectionName) {
    this.filePath = path.join(DATA_DIR, `${collectionName}.json`);
    this.data = this._load();
  }

  _load() {
    if (fs.existsSync(this.filePath)) {
      try {
        return JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  _save() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
  }

  find(query = {}) {
    return this.data.filter(item => {
      for (let key in query) {
        if (query[key] !== undefined && item[key] !== query[key]) return false;
      }
      return true;
    });
  }

  findOne(query = {}) {
    return this.find(query)[0] || null;
  }

  findById(id) {
    return this.data.find(item => item._id === id || item.id === id) || null;
  }

  insertOne(doc) {
    const newDoc = {
      _id: doc._id || 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      createdAt: new Date().toISOString(),
      ...doc
    };
    this.data.push(newDoc);
    this._save();
    return newDoc;
  }

  updateOne(query, update) {
    const index = this.data.findIndex(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...update, updatedAt: new Date().toISOString() };
      this._save();
      return this.data[index];
    }
    return null;
  }

  deleteOne(query) {
    const index = this.data.findIndex(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
    if (index !== -1) {
      const removed = this.data.splice(index, 1)[0];
      this._save();
      return removed;
    }
    return null;
  }

  seedIfEmpty(initialDocs) {
    if (this.data.length === 0 && Array.isArray(initialDocs)) {
      this.data = initialDocs.map((doc, idx) => ({
        _id: 'seed_' + (idx + 1),
        createdAt: new Date().toISOString(),
        ...doc
      }));
      this._save();
    }
  }
}

const stores = {
  users: new SimpleFileStore('users'),
  workouts: new SimpleFileStore('workouts'),
  foodLogs: new SimpleFileStore('food_logs'),
  goals: new SimpleFileStore('goals')
};

async function connectDB() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitnesstracker';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 2000 });
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    isMongoConnected = false;
    console.log('ℹ️  MongoDB not reachable. Utilizing JSON File Database fallback seamlessly.');
  }
}

function getIsMongoConnected() {
  return isMongoConnected;
}

module.exports = {
  connectDB,
  getIsMongoConnected,
  stores
};
