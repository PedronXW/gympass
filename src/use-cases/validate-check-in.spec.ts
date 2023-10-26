import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { afterEach } from 'node:test'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { ValidateCheckInUseCase } from './validate-check-in'

describe('Validate Check-In Use Case', () => {
  let checkInRepository: InMemoryCheckInsRepository
  let sut: ValidateCheckInUseCase

  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInRepository.create({
      user_id: 'user-id',
      gym_id: 'gym-id',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'createdCheckIn.id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate an check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 1, 0, 0))

    const createdCheckIn = await checkInRepository.create({
      user_id: 'user-id',
      gym_id: 'gym-id',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
