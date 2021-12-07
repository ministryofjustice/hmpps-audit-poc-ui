import { Request, Response } from 'express'

import GraphQLDemoService from '../../services/graphQLDemoService'

export default class GraphqlDemoController {
  constructor(private readonly graphQLDemoService: GraphQLDemoService) {}

  async demo(req: Request, res: Response): Promise<void> {
    const currentFrom = req.session.prisonerSearchForm || {}
    res.render('pages/graphql/demo', currentFrom)
  }

  async search(req: Request, res: Response): Promise<void> {
    req.session.prisonerSearchForm = { ...req.body }
    const prisoners = await this.graphQLDemoService.search({}, req.session.prisonerSearchForm)
    res.render('pages/graphql/search-results', { data: JSON.stringify(prisoners) })
  }
}
