import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { Gym, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find((gym) => gym.id === id)

    return gym || null
  }

  async findManyByTitle(query: string, page: number): Promise<Gym[]> {
    const gyms = this.items
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20)

    return gyms
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
        {
          latitude,
          longitude,
        },
      )
      return distance < 10
    })
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      createdAt: new Date(),
    }

    this.items.push(gym)

    return gym
  }
}
