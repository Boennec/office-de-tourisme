const { model, Schema } = require('mongoose')

const newTaskSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type:String,
        required: true
    }
})

module.exports = model('Task', newTaskSchema)