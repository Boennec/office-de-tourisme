const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/electrondb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('DB is connected'))
    .catch(() => console.log(err))