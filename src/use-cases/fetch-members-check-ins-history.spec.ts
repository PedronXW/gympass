import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchUserCheckInsHistoryUseCase } from './fetch-members-check-ins-history'

describe('Fetch User Check-In History Use Case', () => {
  let checkInRepository: InMemoryCheckInsRepository
  let sut: FetchUserCheckInsHistoryUseCase

  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryUseCase(checkInRepository)
  })

  it('should be able to fetch check-in history', async () => {
    await checkInRepository.create({
      user_id: 'user-id',
      gym_id: 'gym-id',
    })
    await checkInRepository.create({
      user_id: 'user-id',
      gym_id: 'gym-id-2',
    })
    const { checkIns } = await sut.execute({
      user_id: 'user-id',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-id' }),
      expect.objectContaining({ gym_id: 'gym-id-2' }),
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        user_id: 'user-id',
        gym_id: 'gym-id-' + i,
      })
    }
    const { checkIns } = await sut.execute({
      user_id: 'user-id',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-id-21' }),
      expect.objectContaining({ gym_id: 'gym-id-22' }),
    ])
  })
})
