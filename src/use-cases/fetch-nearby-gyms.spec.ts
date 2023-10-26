import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

describe('Fetch Nearby Gyms Use Case', () => {
  let gymsRepository: InMemoryGymsRepository
  let sut: FetchNearbyGymsUseCase

  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Gym 1',
      latitude: 0,
      longitude: 0,
    })

    await gymsRepository.create({
      title: 'Gym 2',
      latitude: 30,
      longitude: 30,
    })

    const { gyms } = await sut.execute({
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Gym 1' })])
  })
})
