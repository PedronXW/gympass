import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@prisma/client'

interface FetchUserCheckInsHistoryUseCaseRequest {
  user_id: string
  page: number
}

interface FetchUserCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    user_id,
    page,
  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      user_id,
      page,
    )

    return { checkIns }
  }
}
