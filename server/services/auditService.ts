import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs'
import logger from '../../logger'
import config from '../config'

class AuditService {
  private sqsClient: SQSClient

  constructor(private readonly queueUrl = config.apis.audit.queueUrl) {
    this.sqsClient = new SQSClient({
      region: config.apis.audit.region,
    })
  }

  async sendAuditMessage({
    action,
    who,
    subjectId,
    subjectType,
    details,
  }: {
    action: string
    who: string
    subjectId?: string
    subjectType?: string
    details?: string
  }) {
    try {
      const message = JSON.stringify({
        what: action,
        when: new Date(),
        who,
        subjectId,
        subjectType,
        service: config.apis.audit.serviceName,
        details,
      })

      const messageResponse = await this.sqsClient.send(
        new SendMessageCommand({
          MessageBody: message,
          QueueUrl: this.queueUrl,
        }),
      )

      logger.info(`SQS message sent (${messageResponse.MessageId})`)
      return message
    } catch (error) {
      logger.error('Problem sending message to SQS queue', error)
      throw error
    }
  }
}

export default new AuditService()