import { createClient } from 'redis';
import { promisify } from 'util';


// defining the methods for comonly used redis functions

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (error) => {
      console.log(`Redis client not connected to server: ${error}`);
    })
  }

// the conection status
  isAlive() {
    if (this.client.connected) {
      return true;
    }
    return false;
  }

// get the value for a given key
  async get(key) {
    const redisGet = promisify(this.client.get).bind(this.client);
    const value = await redisGet(key);
    return value
  }

// set a key, value pair to the redis server
  async set(key, value, time) {
    const redisSet = promisify(this.client.set).bind(this.client);
    await redisSet(key, value);
    await this.client.expire(key, time);
  }

//del key value pair from the redis server
  async del(key) {
    const redisDel = promisify(this.client.del).bind(this.client);
    await redisDel(key);
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;

