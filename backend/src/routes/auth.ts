import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { User } from '../models/User'

const signupSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
})

const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
})

export async function authRoutes(fastify: FastifyInstance) {
    // Sign up route
    fastify.post('/auth/signup', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const body = signupSchema.parse(request.body)

            // Check if user already exists
            const existingUser = await User.findOne({ email: body.email })
            if (existingUser) {
                return reply.status(400).send({ error: 'Email already registered' })
            }

            // Create new user
            const user = new User({
                email: body.email,
                password: body.password,
                firstName: body.firstName,
                lastName: body.lastName,
            })

            await user.save()

            const token = fastify.jwt.sign({
                userId: user._id,
                email: user.email,
            })

            reply.status(201).send({
                message: 'User created successfully',
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
            })
        } catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ error: error.issues[0]?.message || 'Invalid input' })
            }
            reply.status(500).send({ error: 'Failed to create user' })
        }
    })

    // Login route
    fastify.post('/auth/login', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const body = loginSchema.parse(request.body)

            // Find user
            const user = await User.findOne({ email: body.email }).select('+password')
            if (!user) {
                return reply.status(401).send({ error: 'Invalid credentials' })
            }

            // Compare password
            const isPasswordValid = await (user as any).comparePassword(body.password)
            if (!isPasswordValid) {
                return reply.status(401).send({ error: 'Invalid credentials' })
            }

            const token = fastify.jwt.sign({
                userId: user._id,
                email: user.email,
            })

            reply.send({
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
            })
        } catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ error: error.issues[0]?.message || 'Invalid input' })
            }
            reply.status(500).send({ error: 'Login failed' })
        }
    })

    // Get current user route
    fastify.get('/auth/me', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify()
            const userId = (request.user as any).userId

            const user = await User.findById(userId).populate('resumes')
            if (!user) {
                return reply.status(404).send({ error: 'User not found' })
            }

            reply.send({
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    resumes: user.resumes,
                },
            })
        } catch (error) {
            reply.status(401).send({ error: 'Unauthorized' })
        }
    })
}
