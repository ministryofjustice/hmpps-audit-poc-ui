import { Request, Response } from 'express'

import GraphQLDemoService from '../../services/graphQLDemoService'

export default class GraphqlDemoController {
  constructor(private readonly graphqlDemoService: GraphQLDemoService) {}

  async demo(req: Request, res: Response): Promise<void> {
    res.render('pages/graphql/demo', {})
  }
}
