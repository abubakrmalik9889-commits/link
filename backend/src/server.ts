import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import jwt from '@fastify/jwt'
import dotenv from 'dotenv'
import { connectDB } from './config/database'
import { authRoutes } from './routes/auth'
import { resumeRoutes } from './routes/resume'

dotenv.config()

const PORT = parseInt(process.env.PORT || '3001')
const NODE_ENV = process.env.NODE_ENV || 'development'
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000'

async function start() {
    try {
        // Connect to MongoDB
        await connectDB()

        // Create Fastify instance
        const fastify = Fastify({
            logger: NODE_ENV === 'development' ? true : false,
        })

        // Register plugins
        await fastify.register(helmet)
        await fastify.register(cors, {
            origin: CORS_ORIGIN,
            credentials: true,
        })
        await fastify.register(jwt, {
            secret: JWT_SECRET,
        })

        // Health check route
        fastify.get('/health', async (request, reply) => {
            return { status: 'ok', timestamp: new Date().toISOString() }
        })

        // Register routes
        await authRoutes(fastify)
        await resumeRoutes(fastify)

        // Start server
        await fastify.listen({ port: PORT, host: '0.0.0.0' })

        console.log(`
    ╔════════════════════════════════════════════════════╗
    ║                                                    ║
    ║   🚀 Fastify Server Running                        ║
    ║   📍 http://localhost:${PORT}                      ║
    ║   🌍 CORS Origin: ${CORS_ORIGIN}                   ║
    ║   📦 Environment: ${NODE_ENV}                      ║
    ║                                                    ║
    ╚════════════════════════════════════════════════════╝
    `)
    } catch (error) {
        console.error('Failed to start server:', error)
        process.exit(1)
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...')
    process.exit(0)
})

start()
