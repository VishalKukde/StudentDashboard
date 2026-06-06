const connectDB = async (uri) => {
  return uri || process.env.MONGODB_URI || null;
};

module.exports = connectDB;