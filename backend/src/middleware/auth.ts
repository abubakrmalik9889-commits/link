import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from '@fastify/jwt'

export async function authenticateUser(request: FastifyRequest, reply: FastifyReply) {
    try {
        await request.jwtVerify()
    } catch (error) {
        reply.status(401).send({ error: 'Unauthorized - Invalid or missing token' })
    }
}

export function generateToken(fastify: any, payload: any, options?: any) {
    return fastify.jwt.sign(payload, options)
}

export function verifyToken(fastify: any, token: string) {
    try {
        return fastify.jwt.verify(token)
    } catch (error) {
        return null
    }
}
