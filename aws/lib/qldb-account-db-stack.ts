import * as cdk from '@aws-cdk/core';
import * as qldb from '@aws-cdk/aws-qldb';

interface QldbBlogDbStackProps extends cdk.StackProps {
  readonly ledgerName: string;
}

export class QldbAccountDbStack extends cdk.Stack {
  public readonly qldbLedger: qldb.CfnLedger;
  public readonly qldbLedgerStreaming: qldb.CfnLedger;

  constructor(scope: cdk.Construct, id: string, props: QldbBlogDbStackProps) {
    super(scope, id, props);

    this.qldbLedger = new qldb.CfnLedger(this, `${id}Ledger`, {
      name: props.ledgerName,
      permissionsMode: 'ALLOW_ALL',
    });
  }
}
