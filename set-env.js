const fs = require('fs');
const path = require('path');

const envDirectory = './src/environments';

if (!fs.existsSync(envDirectory)) {
  fs.mkdirSync(envDirectory, { recursive: true });
  console.log('📁 Carpeta src/environments creada porque no existía');
}

const paths = [
  './src/environments/environment.ts',
  './src/environments/environment.prod.ts'
];

const envConfigFile = `export const environment = {
  production: true,
  locationIqToken: '${(process.env.LOCATION_IQ_TOKEN || "").trim()}',
  apiUrl: '${(process.env.API_URL || "").trim()}',
  groqKey: '${(process.env.GROQ_KEY || "").trim()}'
};`;

// 2. Ahora sí, escribimos los archivos
paths.forEach(filePath => {
  fs.writeFileSync(filePath, envConfigFile);
  console.log(`✅ Archivo generado: ${filePath}`);
});