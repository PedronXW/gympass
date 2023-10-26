import { CheckIn, Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import { randomUUID } from 'node:crypto'
import { CheckInsRepository } from '../check-ins-repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      createdAt: new Date(),
    }

    this.items.push(checkIn)

    return checkIn
  }

  async save(checkIn: CheckIn) {
    const index = this.items.findIndex((item) => item.id === checkIn.id)

    if (index >= 0) {
      this.items[index] = checkIn
    }

    return checkIn
  }

  async countByUserId(userId: string): Promise<number> {
    const checkIns = this.items.filter((CheckIn) => CheckIn.user_id === userId)
    return checkIns.length
  }

  async findById(id: string) {
    const checkIn = this.items.find((CheckIn) => CheckIn.id === id)
    return checkIn || null
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = this.items
      .filter((CheckIn) => CheckIn.user_id === userId)
      .slice((page - 1) * 20, page * 20)

    return checkIns
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSameDate = this.items.find((CheckIn) => {
      const checkInDate = dayjs(CheckIn.createdAt)
      const inOnSomeDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)
      return CheckIn.user_id === userId && inOnSomeDate
    })

    if (!checkInOnSameDate) {
      return null
    }
    return checkInOnSameDate
  }
}
