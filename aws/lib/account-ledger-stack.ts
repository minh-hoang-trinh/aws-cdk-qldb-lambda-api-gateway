import { Stack, StackProps } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export class AccountLedgerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const handler = new lambda.Function(this, `${id}PingLambdaHandler`, {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('../../lambda/ping'),
      handler: 'handler.handler',
    });

    const api = new apigateway.RestApi(this, 'minh-account-ledger-api');

    api.root
      .addResource('ping')
      .addMethod('GET', new apigateway.LambdaIntegration(handler));
  }
}
