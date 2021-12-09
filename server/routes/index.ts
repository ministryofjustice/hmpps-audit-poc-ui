import type { RequestHandler, Router } from 'express'

import graphQLRoutes from './graphql/graphQLRouter'

import asyncMiddleware from '../middleware/asyncMiddleware'
import GraphQLDemoService from '../services/graphQLDemoService'

export interface Services {
  graphQLDemoService: GraphQLDemoService
}

export default function routes(router: Router, services: Services): Router {
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', (req, res, next) => {
    res.render('pages/index')
  })
  graphQLRoutes(router, services)

  return router
}
