import 'dotenv/config';
import app from './app.js';
import { connectDb } from './config/db.js'
import { config } from './config/env.js'
if (!config.jwtSecret) throw new Error('JWT_SECRET manquant : copiez backend/.env.example vers backend/.env');
await connectDb(config.mongoUri);

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`API disponible sur http://localhost:${port}`);
});
