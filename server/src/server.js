const app = require('./app');
const connectDB = require('./config/db');
const { port } = require('./config/env');

(async () => {
  try {
    await connectDB();
    app.listen(port, () => console.log(`API running on http://localhost:${port}`));
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
})();
