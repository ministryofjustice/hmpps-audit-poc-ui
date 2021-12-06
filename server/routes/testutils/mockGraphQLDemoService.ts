import GraphQLDemoService from '../../services/graphQLDemoService'

jest.mock('../../services/graphQLDemoService')

const graphQLDemoService = new GraphQLDemoService() as jest.Mocked<GraphQLDemoService>

export default graphQLDemoService
