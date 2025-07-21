const logger = require("../utils/logger");
const { redis } = require("../utils/redis");

// export const redisService = {
//     /**
//      * Store an array in Redis using a list.
//      * @param key Redis key (e.g. user ID)
//      * @param values Array of strings to store (e.g. [accessToken, refreshToken])
//      */
//     async setArray(key: string, values: string[]): Promise < void > {
//         if (!key || !Array.isArray(values)) throw new Error("Invalid input");

//         // Remove old list if exists
//         await redis.del(key);

//         // Push all values to the list
//         if (values.length > 0) {
//             await redis.rpush(key, ...values);
//         }
//     },

//     /**
//      * Get an array from Redis
//      */
//     async getArray(key: string): Promise < string[] > {
//         return await redis.lrange(key, 0, -1);
//     }
// };

const redisService = {
    /**
     * Store an array in Redis using a list.
     * @param {string} key Redis key (e.g. user ID)
     * @param {string[]} values Array of strings to store (e.g. [accessToken, refreshToken])
     */
    async setArray(key, values) {
        if (!key || !Array.isArray(values)) throw new Error("Invalid input");

        // Remove old list if exists
        await redis.del(key);

        // Push all values to the list
        if (values.length > 0) {
            await redis.rpush(key, ...values);
        }
    },

    /**
     * Get an array from Redis
     * @param {string} key
     * @returns {Promise<string[]>}
     */
    async getArray(key) {
        return await redis.lrange(key, 0, -1);
    },

    /**
     * Delete an array from Redis.
     * @param {string} key Redis key to delete.
     */
    async delArray(key) {
        await redis.del(key);
    }
};

module.exports = redisService;