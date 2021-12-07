import { PrisonerSearchForm } from '../@types/express'
import HmppsAuthClient from '../data/hmppsAuthClient'
import RestClient from '../data/restClient'
import config from '../config'

export interface Context {
  username?: string
}

interface PrisonerData {
  firstName: string
}
interface PrisonerQuery {
  data: {
    offenderById: PrisonerData
    offendersByLastName: PrisonerData[]
  }
}

export default class GraphQLDemoService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  private static restClient(token: string): RestClient {
    return new RestClient('GraphQL API Client', config.apis.graphQLEndpoint, token)
  }

  async search(context: Context, request: PrisonerSearchForm): Promise<PrisonerData[]> {
    const token = await this.hmppsAuthClient.getSystemClientToken(context.username)

    return request.prisonerNumber ? this.searchById(token, request) : this.searchByLastName(token, request)
  }

  private async searchById(token: string, request: PrisonerSearchForm): Promise<PrisonerData[]> {
    const response = await GraphQLDemoService.restClient(token).post<PrisonerQuery>({
      path: `/graphql`,
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({
        query: `{
          offenderById(id: "${request.prisonerNumber}") {
            firstName, 
            sentences {
              description, length, startDate, offences {
                description
              }
            }
          }
        }`,
      }),
    })

    return [response.data.offenderById]
  }

  private async searchByLastName(token: string, request: PrisonerSearchForm): Promise<PrisonerData[]> {
    const response = await GraphQLDemoService.restClient(token).post<PrisonerQuery>({
      path: `/graphql`,
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({
        query: `{
          offendersByLastName(lastName: "${request.lastName}") {
            id,
            firstName, 
            lastName,
            dateOfBirth,
            sentences {
              id, description, length, startDate, offences {
                id,
                description,
              }
            }
          }
        }`,
      }),
    })

    return response.data.offendersByLastName
  }
}
