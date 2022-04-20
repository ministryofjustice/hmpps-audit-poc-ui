import createApp from './app'
import HmppsAuthClient from './data/hmppsAuthClient'
import { createRedisClient } from './data/redisClient'
import TokenStore from './data/tokenStore'
import GraphQLDemoService from './services/graphQLDemoService'
import UserService from './services/userService'

const hmppsAuthClient = new HmppsAuthClient(new TokenStore(createRedisClient()))
const userService = new UserService(hmppsAuthClient)
const graphQLDemoService = new GraphQLDemoService(hmppsAuthClient)

const app = createApp(userService, graphQLDemoService)

export default app
