// base de test isolée : jamais la base de développement
process.env.MONGODB_URI = process.env.MONGODB_TEST_URI ?? "mongodb://127.0.0.1:27017/habitflow_test";
process.env.JWT_SECRET = "test-secret";
