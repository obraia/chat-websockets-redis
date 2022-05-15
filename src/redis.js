const redis = require('redis');

class Redis {
  constructor() {
    this.client = redis.createClient({
      url: process.env.REDISCLOUD_URL,
    });

    this.start();
  }

  async start() {
    this.client.connect();

    this.client.on('error', err => {
      console.log('Redis Client Error', err);
    });
  }

  async set(key, value) {
    return this.client.set(key, JSON.stringify(value), redis.print);
  }

  async hset(key, hashtest, value) {
    return this.client.hSet(key, hashtest, JSON.stringify(value));
  }

  async get(key) {
    return this.client.get(key);
  }

  async hGet(key) {
    return new Promise((resolve, reject) => {
      this.client.hGetAll(key).then(messages => {
        const m = [];

        for (const key in messages) {
          m.push(JSON.parse(messages[key]));
        }

        return resolve(m.sort((a, b) => a.timestamp - b.timestamp));
      });
    });
  }

  async del(key) {
    return this.client.del(key);
  }

  async exists(key) {
    return this.client.exists(key);
  }
}

module.exports = Redis;
