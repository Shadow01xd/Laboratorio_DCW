const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // RUTA SEGURA

const Technology = require('../models/Technology');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conexión a MongoDB exitosa');
  } catch (err) {
    console.error('❌ Error de conexión a MongoDB:', err.message);
    process.exit(1);
  }
};

const migrateTechnologyImagePaths = async () => {
  await connectDB();

  try {
    console.log('📦 Iniciando migración de rutas de imágenes...');
    const technologies = await Technology.find({});
    let updatedCount = 0;

    for (let tech of technologies) {
      if (tech.image && !tech.image.startsWith('/uploads/technologies/')) {
        const filename = path.basename(tech.image);
        const newPath = `/uploads/technologies/${filename}`;
        if (tech.image !== newPath) {
          tech.image = newPath;
          await tech.save();
          console.log(`🛠️ ${tech.name} actualizado: ${newPath}`);
          updatedCount++;
        }
      }
    }

    console.log(`✅ Migración completada. ${updatedCount} tecnologías actualizadas.`);
  } catch (err) {
    console.error('❌ Error durante la migración:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
};

migrateTechnologyImagePaths();
