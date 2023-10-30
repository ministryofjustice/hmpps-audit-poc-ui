import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './testutils/appSetup'
import auditService from '../services/auditService'

let app: Express

const sendAuditMessageMock = jest.fn()

afterEach(() => {
  jest.resetAllMocks()
})

describe('index.test.ts', () => {
  jest.mock('../services/auditService', () => ({
    sendAuditMessage: sendAuditMessageMock,
  }))

  beforeEach(() => {
    app = appWithAllRoutes({})
    jest.spyOn(auditService, 'sendAuditMessage').mockResolvedValue({} as never)
  })

  describe('GET /', () => {
    it('should render index page', () => {
      return request(app)
        .get('/')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Click this button to trigger an event')
          expect(res.text).toContain('Trigger Event')
        })
    })
  })

  it('GET /triggered-event', () => {
    const mockPublishedEvent = {
      action: 'TEST_EVENT',
      who: 'some username',
      subjectId: 'some user ID',
      subjectType: 'USER_ID',
      details: JSON.stringify({ testField: 'some value' }),
    }

    return request(app)
      .get('/triggered-event')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Congratulations! 🎉')
        expect(res.text).toContain(
          "You've just published an event that has been pushed to a queue. This event will be stored in the audit",
        )
        expect(res.text).toContain('Published Message (JSON Format):')
        expect(res.text).toContain("Here's an explanation of what this message means:")
        expect(res.text).toContain('What:</b> Which action was performed?')
        expect(res.text).toContain('<b>When:</b> Timestamp of the event.')
        expect(res.text).toContain('<b>Who:</b> Which user initiated the event?')
        expect(res.text).toContain('<b>Subject ID:</b> The subject against which the action was performed.')
        expect(res.text).toContain(
          '<b>Subject Type:</b> The type of subject ID we are using. This is most commonly a user ID.',
        )
        expect(res.text).toContain('<b>Service:</b> Which service performed this action?')
        expect(res.text).toContain(
          '<b>Details:</b> Any additional details specific to this action that may be relevant can go here.',
        )
      })
      .expect(() => {
        expect(auditService.sendAuditMessage).toBeCalledWith(mockPublishedEvent)
      })
  })
})
