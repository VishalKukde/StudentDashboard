require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`API running on port ${PORT} without MongoDB`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

if (require.main === module) {
  start();
}

module.exports = { app, start };