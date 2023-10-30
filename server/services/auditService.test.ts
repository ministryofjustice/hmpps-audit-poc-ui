import { SQSClient } from '@aws-sdk/client-sqs'
import auditService from './auditService'

const adminId = 'some admin'
const userId = 'some user'
const userIdSubjectType = 'USER_ID'

describe('Audit service', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('sends audit message', async () => {
    jest.spyOn(SQSClient.prototype, 'send').mockResolvedValue({} as never)
    const expectedWhat = 'DISABLE_USER'

    jest.spyOn(SQSClient.prototype, 'send').mockResolvedValue({} as never)
    await auditService.sendAuditMessage({
      action: 'DISABLE_USER',
      who: adminId,
      subjectId: userId,
      subjectType: userIdSubjectType,
      details: JSON.stringify({ something: 'some details' }),
    })
    const { MessageBody, QueueUrl } = (SQSClient.prototype.send as jest.Mock).mock.calls[0][0].input
    const { what, when, who, service, subjectId, subjectType, details } = JSON.parse(MessageBody)

    expect(QueueUrl).toEqual('http://localhost:4566/000000000000/mainQueue')
    expect(what).toEqual(expectedWhat)
    expect(when).toBeDefined()
    expect(who).toEqual(adminId)
    expect(subjectId).toEqual(subjectId)
    expect(subjectType).toEqual(userIdSubjectType)
    expect(service).toEqual('hmpps-audit-poc-ui')
    expect(details).toEqual('{"something":"some details"}')
  })
})
