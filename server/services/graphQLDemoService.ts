import { PrisonerSearchForm } from '../@types/express'
import HmppsAuthClient from '../data/hmppsAuthClient'
import RestClient from '../data/restClient'
import config from '../config'
import logger from '../../logger'

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
    // for clarity show making a query for a single prisoner using parameters
    if (requiresAllData(request)) {
      const { prisonerNumber } = request
      const query = `query($prisonerNumber: String!) {
        offenderById(id: $prisonerNumber)  {
          id
          firstName
          lastName
          dateOfBirth
          offenderManagers {
            firstName
            lastName
            responsibleOfficer
            type
          }
          sentences {
            id
            description
            length
            startDate
            offences {
              id
              description
            }
          }
        }
      }`

      const response = await GraphQLDemoService.restClient(token).post<PrisonerQuery>({
        path: `/graphql`,
        headers: { 'Content-Type': 'application/json' },
        data: {
          query,
          variables: {
            prisonerNumber,
          },
        },
      })

      logger.info(`GraphQL response for single offender: ${JSON.stringify(response, null, 3)}`)
      return [response.data.offenderById]
    }
    const query = `{
        offenderById(id: "${request.prisonerNumber}") ${buildQueryDataRequest(request)} 
        }`
    const response = await this.executeQuery<PrisonerQuery>(token, query)

    return [response.data.offenderById]
  }

  private async searchByLastName(token: string, request: PrisonerSearchForm): Promise<PrisonerData[]> {
    const query = `{
    offendersByLastName(lastName: "${request.lastName}") ${buildQueryDataRequest(request)}
    }`
    const response = await this.executeQuery<PrisonerQuery>(token, query)

    return response.data.offendersByLastName
  }

  private async executeQuery<T>(token: string, query: string): Promise<T> {
    logger.info(`GraphQL query: ${query}`)

    const response = await GraphQLDemoService.restClient(token).post({
      path: `/graphql`,
      headers: { 'Content-Type': 'application/json' },
      data: { query },
    })

    logger.info(`GraphQL response: ${JSON.stringify(response, null, 3)}`)

    return response as T
  }
}

function buildQueryDataRequest(request: PrisonerSearchForm): string {
  const offenderManagers = request.data?.includes('offenderManagers')
    ? `offenderManagers {
        firstName,
        lastName,
        responsibleOfficer,
        type
      }
      `
    : ''

  const offences = request.data?.includes('offences')
    ? `offences {
          id,
          description,
        }
      `
    : ''
  // eslint-disable-next-line no-nested-ternary
  const sentence = request.data?.includes('sentences')
    ? `sentences {
        id, description, length, startDate, ${offences}
      }
    `
    : request.data?.includes('offences')
    ? `sentences {
        ${offences}
      }
    `
    : ''

  const offenderDetails = request.data?.includes('basicDetails')
    ? `firstName, 
      lastName,
      dateOfBirth,`
    : ''
  return `{
      id,
      ${offenderManagers}
      ${offenderDetails}
      ${sentence}
    }
  `
}

function requiresAllData(request: PrisonerSearchForm): boolean {
  return request.data.length === 4
}
