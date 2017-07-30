/**
 * Created by moyu on 2017/7/30.
 */

const Router = require('express').Router
const jsRoute = require('./js-route')

const router = new Router()

router.all(/\.jsx?$/, jsRoute)

module.exports = router