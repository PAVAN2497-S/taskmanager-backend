const mongoose = require('mongoose')

const configureDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`connected to db ${mongoose.connection.host}`)

    } catch (e) {
        console.error('error in connecting db', e)
    }
}

module.exports = configureDb