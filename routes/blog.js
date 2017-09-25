const express = require('express')
const router = express.Router()

const blogController = require('../controllers/index').blogController

router.get('/', blogController.index)
router.get('/new', blogController.new)
router.post('/', blogController.create)

module.exports = router
