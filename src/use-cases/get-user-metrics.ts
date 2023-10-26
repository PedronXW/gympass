import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface GetUserMetricsUseCaseRequest {
  user_id: string
}

interface GetUserMetricsUseCaseResponse {
  checkInsCount: number
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    user_id,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(user_id)

    return { checkInsCount }
  }
}
