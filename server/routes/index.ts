import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import { auditService } from '../services/auditService'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(service: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', (req, res, next) => {
    res.render('pages/index', { eventLink: '/triggered-event' })
  })

  get('/triggered-event', async (req, res, next) => {
    const publishedEvent = await auditService.sendAuditMessage({
      action: 'TEST_EVENT',
      who: 'some username',
      subjectId: 'some user ID',
      subjectType: 'USER_ID',
      details: JSON.stringify({ testField: 'some value' }),
    })
    res.render('pages/triggeredEvent', {
      publishedEvent,
    })
  })

  return router
}
