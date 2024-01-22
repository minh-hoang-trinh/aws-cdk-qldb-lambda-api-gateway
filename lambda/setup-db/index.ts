import { QldbDriver } from 'amazon-qldb-driver-nodejs';
import { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const qldbDriver = new QldbDriver(process.env.LEDGER_NAME ?? '');

  const existingTableNames = await qldbDriver.getTableNames();
  const tablesToCreate = ['balances', 'provisions'].filter(
    (table) => !existingTableNames.includes(table)
  );

  await qldbDriver.executeLambda(async (txn) =>
    Promise.all(
      tablesToCreate.map((tableToCreate) =>
        txn.execute(`CREATE TABLE ${tableToCreate}`)
      )
    )
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'success',
    }),
  };
};
