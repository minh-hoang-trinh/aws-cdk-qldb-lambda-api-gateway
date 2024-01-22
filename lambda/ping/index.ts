import { QldbDriver } from 'amazon-qldb-driver-nodejs';
import { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const qldbDriver = new QldbDriver(process.env.LEDGER_NAME ?? '');

  const tableNames = await qldbDriver.getTableNames();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'pong',
      tableNames,
    }),
  };
};
