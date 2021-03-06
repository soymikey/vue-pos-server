const isDev = process.env.NODE_ENV === 'development'

const config = {
    database: isDev ? 'blogdev' : 'react-blog',
    user: isDev ? 'root' : '',
    password: isDev ? '123456' : '',
    options: {
        host: isDev ? 'localhost' : '', // 连接的 host 地址
        dialect: 'mongodb', // 连接到 mongodb
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
}

module.exports = config