import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk'

const dynamodb = new AWS.DynamoDB.DocumentClient(); //allows us to interaction with dynamodb table

async function createAuction(event, context) {

  const { title } = JSON.parse(event.body)
  const now = new Date()

  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString()
  }

  // insert data in dynamoDB table
  await dynamodb.put({
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Item: auction
  }).promise()


  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = createAuction;

