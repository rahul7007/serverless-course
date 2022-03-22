import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk'
import middy from '@middy/core'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import httpEventNormalizer from '@middy/http-event-normalizer'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'

const dynamodb = new AWS.DynamoDB.DocumentClient(); //allows us to interaction with dynamodb table

async function createAuction(event, context) {

  const { title } = event.body
  const now = new Date()

  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
    highestBid: {
      amount: 0,
    }
  }

  // insert data in dynamoDB table
  try {
    await dynamodb.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction
    }).promise()
  } catch (err) {
    console.error(err)
    throw new createError.InternalServerError(error)
  }



  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = middy(createAuction)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler())

