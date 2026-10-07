import 'dotenv/config'

export const config = {
    port: Number(process.env.PORT),
    mongoUri: process.env.MONGODB_URI,
    corsOrigin: 'http://localhost:5173',
    jwtSecret: process.env.JWT_SECRET
}