import type { RequestHandler, Router } from 'express'

import asyncMiddleware from '../../middleware/asyncMiddleware'
import GraphQLDemoService from '../../services/graphQLDemoService'
import GraphQLDemoController from './graphQLDemoController'

export interface Services {
  graphQLDemoService: GraphQLDemoService
}
export default function routes(router: Router, services: Services): Router {
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const graphqlDemoController = new GraphQLDemoController(services.graphQLDemoService)

  get('/graphql/demo', (req, res) => graphqlDemoController.demo(req, res))

  return router
}
