import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'

describe('Search Gyms Use Case', () => {
  let gymsRepository: InMemoryGymsRepository
  let sut: SearchGymsUseCase

  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Gym 1',
      latitude: 0,
      longitude: 0,
    })

    await gymsRepository.create({
      title: 'Gym 2',
      latitude: 0,
      longitude: 0,
    })

    const { gyms } = await sut.execute({
      query: 'Gym 1',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Gym 1' })])
  })

  it('should be able to fetch paginated search gyms', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: 'Gym ' + i,
        description: 'Gym ' + i + ' description',
        phone: '123456789',
        latitude: 0,
        longitude: 0,
      })
    }
    const { gyms } = await sut.execute({
      query: 'Gym',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Gym 21' }),
      expect.objectContaining({ title: 'Gym 22' }),
    ])
  })
})
