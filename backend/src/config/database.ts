import mongoose from 'mongoose'

export async function connectDB() {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-builder'

    try {
        await mongoose.connect(mongoUri)
        console.log('✅ MongoDB connected successfully')
        return mongoose.connection
    } catch (error) {
        console.error('❌ MongoDB connection error:', error)
        process.exit(1)
    }
}

export async function disconnectDB() {
    try {
        await mongoose.disconnect()
        console.log('✅ MongoDB disconnected')
    } catch (error) {
        console.error('❌ MongoDB disconnection error:', error)
    }
}
