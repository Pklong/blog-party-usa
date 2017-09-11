const express = require('express')
const router = express.Router()

const blogController = require('../controllers/index').blogController

router.get('/', blogController.index)

module.exports = router
