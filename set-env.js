const fs = require('fs');

const targetPath = './src/environments/environment.prod.ts';


const envConfigFile = `
export const environment = {
  production: true,
  locationIqToken: '${process.env.LOCATION_IQ_TOKEN || ""}',
  apiUrl: '${process.env.API_URL || ""}',
  groqKey: '${process.env.GROQ_KEY || ""}'
};
`;

fs.writeFileSync(targetPath, envConfigFile);

console.log('✅ Archivo environment.prod.ts generado con éxito');