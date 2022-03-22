
import AWS from 'aws-sdk'
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors'

const dynamodb = new AWS.DynamoDB.DocumentClient(); //allows us to interaction with dynamodb table

export async function getAuctionById(id) {
    let auction;
    try {
        const result = await dynamodb.get({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key: { id }
        }).promise()

        auction = result.Item

    } catch (err) {
        console.error(err);
        throw new createError.InternalServerError(err)
    }

    if (!auction) {
        throw new createError.NotFound(`auction with id ${id} not found`)
    }

    return auction;
}

async function getAuction(event, context) {
    const { id } = event.pathParameters;
    const auction = await getAuctionById(id);

    return {
        statusCode: 200,
        body: JSON.stringify(auction),
    };
}

export const handler = commonMiddleware(getAuction)

