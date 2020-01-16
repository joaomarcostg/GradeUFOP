const express = require('express')
const PickerController = require('./controllers/PickerController.js')

const routes = express.Router()

routes.get('/deptos', PickerController.deptos)
routes.get('/discs', PickerController.discs)
routes.get('/pickeds', PickerController.pickeds)
routes.get('/turmas', PickerController.turmas)

module.exports = routes