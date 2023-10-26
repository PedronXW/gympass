import { InvalidCredentialError } from '@/use-cases/errors/invalid-credential-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = registerBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUseCase.execute({ email, password })

    const token = await reply.jwtSign(
      { role: user.role },
      { sign: { sub: user.id } },
    )

    const refreshToken = await reply.jwtSign(
      { role: user.role },
      { sign: { sub: user.id, expiresIn: '7d' } },
    )

    return reply
      .status(200)
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .send({ token })
  } catch (err) {
    if (err instanceof InvalidCredentialError) {
      return reply.status(400).send({ message: err.message })
    }
    throw err
  }
}
