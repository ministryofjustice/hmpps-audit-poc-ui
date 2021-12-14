import { Request, Response } from 'express'

import GraphQLDemoService from '../../services/graphQLDemoService'

export default class GraphqlDemoController {
  constructor(private readonly graphQLDemoService: GraphQLDemoService) {}

  async demo(req: Request, res: Response): Promise<void> {
    const form = req.session.prisonerSearchForm || {}
    const errors = req.flash('errors') || []
    res.render('pages/graphql/demo', { form, errors })
  }

  async details(req: Request, res: Response): Promise<void> {
    const { id } = req.query as { id: string }
    const form = req.session.prisonerSearchForm || {}
    req.session.prisonerSearchForm = { ...form, prisonerNumber: id }
    const prisoners = await this.graphQLDemoService.search({}, req.session.prisonerSearchForm)
    res.render('pages/graphql/prisoner-details', { data: JSON.stringify(prisoners), prisoner: prisoners[0] })
  }

  async search(req: Request, res: Response): Promise<void> {
    req.session.prisonerSearchForm = { ...req.body }
    const prisoners = await this.graphQLDemoService.search({}, req.session.prisonerSearchForm)

    if (prisoners.length > 1) {
      res.render('pages/graphql/search-results', { prisoners })
    } else if (prisoners.length === 1) {
      res.render('pages/graphql/prisoner-details', { prisoner: prisoners[0] })
    } else {
      req.flash('errors', [{ text: 'No prisoners found' }])
      res.redirect('/graphql/demo')
    }
  }
}
