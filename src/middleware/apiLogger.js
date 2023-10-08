import logger from "../logger/logger.js"

export default (req, res, next)=>{
    logger.info(`${req.method} ${req.url} ${req.ip}`)
    next()
}