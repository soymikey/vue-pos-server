module.exports = (ctx, next) => {
    return next().catch(err => {
        if (err.status === 401) {
            ctx.status = 401
            // ctx.body = { error: err.originalError ? err.originalError.message : err.message }
            ctx.body = { code: 401, message: '你还未登入或者你的登入已过期,请重新登入...' }
        } else {
            throw err
        }
    })
}