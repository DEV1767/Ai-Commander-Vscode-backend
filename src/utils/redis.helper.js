import redisClient from "../config/redis.config.js"

export const setRedis = async (key, value, expiry = 600) => {
    try {
        await redisClient.set(key, JSON.stringify(value), {
            EX: expiry,
        })
        return true
    } catch (error) {
        console.log("Redis SET Error:", error.message)
        return null
    }
}

export const getRedis = async (key) => {
    try {
        const value = await redisClient.get(key)

        if (!value) {
            return null
        }
        return JSON.parse(value)
    } catch (error) {
        console.error("Redis GET Error", error.message)
        return null;
    }
}
export const deleteRedis = async (key) => {
    try {
        await redisClient.del(key)
        return true
    } catch (error) {
        console.log("Redis DELETED Error:", error.message)
        return false
    }
}

export const existsRedis = async (key) => {
    try {
        const exists = await redisClient.exists(key);

        return exists === 1;
    } catch (error) {
        console.log("Redis Exists Error:", error.message)
        return false
    }

}
