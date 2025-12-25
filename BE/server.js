require ('dotenv').config();
const app = require('./src/app');

app.listen(3001, '127.0.0.1', () => {
  console.log('Server FORCE listening on http://127.0.0.1:3001');
});
