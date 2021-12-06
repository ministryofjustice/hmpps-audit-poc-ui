import createApp from './app'
import HmppsAuthClient from './data/hmppsAuthClient'
import TokenStore from './data/tokenStore'
import GraphQLDemoService from './services/graphQLDemoService'
import UserService from './services/userService'

const hmppsAuthClient = new HmppsAuthClient(new TokenStore())
const userService = new UserService(hmppsAuthClient)
const graphQLDemoService = new GraphQLDemoService()

const app = createApp(userService, graphQLDemoService)

export default app
