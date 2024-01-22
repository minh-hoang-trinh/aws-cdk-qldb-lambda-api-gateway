import { Arn, Stack, StackProps } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import * as qldb from 'aws-cdk-lib/aws-qldb';

interface QldbAccountDbStackProps extends StackProps {
  readonly ledgerName: string;
}

export class AccountLedgerStack extends Stack {
  public readonly qldbLedger: qldb.CfnLedger;

  constructor(scope: Construct, id: string, props: QldbAccountDbStackProps) {
    super(scope, id, props);

    this.qldbLedger = new qldb.CfnLedger(this, `${id}Ledger`, {
      name: props.ledgerName,
      permissionsMode: 'ALLOW_ALL',
    });

    const lambdaProps = {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      environment: {
        LEDGER_NAME: props.ledgerName,
      },
    };

    const pingHandler = new lambda.Function(this, `${id}PingLambdaHandler`, {
      ...lambdaProps,
      code: lambda.Code.fromAsset('./lambda/ping'),
    });

    const setupDbHandler = new lambda.Function(
      this,
      `${id}SetupDBLambdaHandler`,
      {
        ...lambdaProps,
        code: lambda.Code.fromAsset('./lambda/setup-db'),
      }
    );

    const qldbLedgerDbArn = Arn.format({
      resource: 'ledger',
      resourceName: props.ledgerName,
      service: 'qldb',
      account: props.env?.account,
      region: props.env?.region,
      partition: 'aws',
    });

    [pingHandler, setupDbHandler].forEach((handler) =>
      handler.addToRolePolicy(
        new PolicyStatement({
          actions: ['qldb:SendCommand'],
          resources: [qldbLedgerDbArn],
        })
      )
    );

    const api = new apigateway.RestApi(this, 'minh-account-ledger-api');

    api.root
      .addResource('ping')
      .addMethod('GET', new apigateway.LambdaIntegration(pingHandler));

    api.root
      .addResource('setup-db')
      .addMethod('POST', new apigateway.LambdaIntegration(setupDbHandler));
  }
}
