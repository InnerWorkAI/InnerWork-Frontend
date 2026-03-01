const fs = require('fs');

const paths = [
  './src/environments/environment.ts',
  './src/environments/environment.prod.ts'
];

const envConfigFile = `
export const environment = {
  production: true,
  locationIqToken: '${process.env.LOCATION_IQ_TOKEN || ""}',
  API_URL: '${process.env.API_URL || ""}',
  groqKey: '${process.env.GROQ_KEY || ""}'
};
`;

paths.forEach(path => {
  fs.writeFileSync(path, envConfigFile);
  console.log(`✅ Generado: ${path}`);
});
