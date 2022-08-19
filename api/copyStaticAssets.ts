import fs from 'fs';

fs.mkdirSync('dist/src');
fs.mkdirSync('dist/src/openapi');
fs.copyFileSync('src/openapi/apiSchema.yml', 'dist/src/openapi/apiSchema.yml');
