import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserMetricsUseCase } from './get-user-metrics'

describe('Get User Metrics Use Case', () => {
  let checkInRepository: InMemoryCheckInsRepository
  let sut: GetUserMetricsUseCase

  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInRepository)
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkInRepository.create({
      user_id: 'user-id',
      gym_id: 'gym-id',
    })
    await checkInRepository.create({
      user_id: 'user-id',
      gym_id: 'gym-id-2',
    })
    const { checkInsCount } = await sut.execute({ user_id: 'user-id' })

    expect(checkInsCount).toEqual(2)
  })
})
