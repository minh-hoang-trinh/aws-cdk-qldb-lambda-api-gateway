import * as qldb from 'amazon-qldb-driver-nodejs';
import * as lambda from 'aws-lambda';

interface Result {
  readonly PhysicalResourceId?: string;
  readonly Data?: JSON;
}

export async function onEvent(
  event: lambda.CloudFormationCustomResourceEvent,
  context: lambda.Context
): Promise<Result> {
  console.log(`Processing request: `, event);

  const qldbDriver = new qldb.QldbDriver(event.ResourceProperties.LedgerName);

  switch (event.RequestType) {
    case 'Create':
      return onCreate(event, qldbDriver);
    case 'Update':
      return onUpdate(event, qldbDriver);
    case 'Delete':
      return onDelete(event, qldbDriver);
  }
}

export async function onCreate(
  event: lambda.CloudFormationCustomResourceEvent,
  qldbDriver: qldb.QldbDriver
): Promise<Result> {
  const ledgerName = event.ResourceProperties.LedgerName;
  const customResourceId = event.ResourceProperties.CustomResourceId;

  const existingTableNames = await qldbDriver.getTableNames();

  await qldbDriver.executeLambda(async (txn) =>
    Promise.all(
      ['balances', 'provisions']
        .filter((table) => !existingTableNames.includes(table))
        .map((tableToCreate) => txn.execute('CREATE TABLE ?', tableToCreate))
    )
  );

  const physicalId = `${customResourceId}-${ledgerName}`;
  return {
    PhysicalResourceId: physicalId,
  };
}

export async function onUpdate(
  event: lambda.CloudFormationCustomResourceEvent,
  qldbDriver: qldb.QldbDriver
): Promise<Result> {
  console.log('onUpdate');
  return {};
}

export async function onDelete(
  event: lambda.CloudFormationCustomResourceEvent,
  qldbDriver: qldb.QldbDriver
): Promise<Result> {
  console.log('onDelete');
  return {};
}
