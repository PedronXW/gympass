import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

describe('Check-In Use Case', () => {
  let checkInRepository: InMemoryCheckInsRepository
  let gymsRepository: InMemoryGymsRepository
  let sut: CheckInUseCase

  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInRepository, gymsRepository)
    await gymsRepository.create({
      id: 'gym-id',
      title: 'Gym Name',
      description: 'Gym Description',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
      phone: '123456789',
    })
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      id: 'user-id',
      gymId: 'gym-id',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 1, 0, 0))
    await sut.execute({
      id: 'user-id',
      gymId: 'gym-id',
      userLatitude: 0,
      userLongitude: 0,
    })

    await expect(() =>
      sut.execute({
        id: 'user-id',
        gymId: 'gym-id',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should not be able to check in twice in different day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 0, 0, 0))
    await sut.execute({
      id: 'user-id',
      gymId: 'gym-id',
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 0, 0, 0))

    const { checkIn } = await sut.execute({
      id: 'user-id',
      gymId: 'gym-id',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    await gymsRepository.create({
      id: 'gym-id-2',
      title: 'Gym Name',
      description: 'Gym Description',
      latitude: new Decimal(80),
      longitude: new Decimal(80),
      phone: '123456789',
    })

    await expect(() =>
      sut.execute({
        id: 'user-id',
        gymId: 'gym-id-2',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
