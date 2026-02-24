import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { Resume } from '../models/Resume'
import { User } from '../models/User'

export async function resumeRoutes(fastify: FastifyInstance) {
    // Create resume
    fastify.post('/resumes', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify()
            const userId = (request.user as any).userId
            const body = request.body as any

            const resume = new Resume({
                userId,
                name: body.name || 'Untitled Resume',
                templateId: body.templateId || 'modern-slate',
                personalInfo: body.personalInfo || {},
            })

            await resume.save()

            // Add resume to user's resume list
            await User.findByIdAndUpdate(userId, {
                $push: { resumes: resume._id },
            })

            reply.status(201).send(resume)
        } catch (error) {
            reply.status(500).send({ error: 'Failed to create resume' })
        }
    })

    // Get all resumes for user
    fastify.get('/resumes', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify()
            const userId = (request.user as any).userId

            const resumes = await Resume.find({ userId }).sort({ createdAt: -1 })
            reply.send(resumes)
        } catch (error) {
            reply.status(401).send({ error: 'Unauthorized' })
        }
    })

    // Get single resume
    fastify.get('/resumes/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const resume = await Resume.findById((request.params as any).id)

            if (!resume) {
                return reply.status(404).send({ error: 'Resume not found' })
            }

            // If resume is public, allow access; otherwise, verify ownership
            if (!resume.isPublic) {
                await request.jwtVerify()
                const userId = (request.user as any).userId
                if (resume.userId.toString() !== userId) {
                    return reply.status(403).send({ error: 'Forbidden' })
                }
            }

            reply.send(resume)
        } catch (error) {
            reply.status(401).send({ error: 'Unauthorized' })
        }
    })

    // Update resume
    fastify.put('/resumes/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify()
            const userId = (request.user as any).userId
            const resumeId = (request.params as any).id
            const body = request.body as any

            const resume = await Resume.findById(resumeId)
            if (!resume) {
                return reply.status(404).send({ error: 'Resume not found' })
            }

            if (resume.userId.toString() !== userId) {
                return reply.status(403).send({ error: 'Forbidden' })
            }

            Object.assign(resume, body)
            await resume.save()

            reply.send(resume)
        } catch (error) {
            reply.status(500).send({ error: 'Failed to update resume' })
        }
    })

    // Delete resume
    fastify.delete('/resumes/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify()
            const userId = (request.user as any).userId
            const resumeId = (request.params as any).id

            const resume = await Resume.findById(resumeId)
            if (!resume) {
                return reply.status(404).send({ error: 'Resume not found' })
            }

            if (resume.userId.toString() !== userId) {
                return reply.status(403).send({ error: 'Forbidden' })
            }

            await Resume.findByIdAndDelete(resumeId)
            await User.findByIdAndUpdate(userId, {
                $pull: { resumes: resumeId },
            })

            reply.send({ message: 'Resume deleted successfully' })
        } catch (error) {
            reply.status(500).send({ error: 'Failed to delete resume' })
        }
    })

    // Public resume route (with shareableLink)
    fastify.get('/resumes/public/:shareableLink', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const resume = await Resume.findOne({ shareableLink: (request.params as any).shareableLink })

            if (!resume || !resume.isPublic) {
                return reply.status(404).send({ error: 'Resume not found' })
            }

            // Increment views
            resume.views += 1
            await resume.save()

            reply.send(resume)
        } catch (error) {
            reply.status(500).send({ error: 'Failed to fetch resume' })
        }
    })
}
