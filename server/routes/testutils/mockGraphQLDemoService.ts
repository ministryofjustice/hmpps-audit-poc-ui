import HmppsAuthClient from '../../data/hmppsAuthClient'
import GraphQLDemoService from '../../services/graphQLDemoService'

jest.mock('../../services/graphQLDemoService')

const graphQLDemoService = new GraphQLDemoService({} as HmppsAuthClient) as jest.Mocked<GraphQLDemoService>

export default graphQLDemoService
