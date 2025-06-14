const mongoose = require('mongoose')

const connectDB = async () => {
  const uri = process.env.MONGO_URI

  if (!uri) {
    console.error('❌ Error: MONGO_URI no está definida en el archivo .env')
    process.exit(1)
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('✅ Conexión establecida con MongoDB Atlas')
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error)
    process.exit(1)
  }
}

module.exports = connectDB
