#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { AccountLedgerStack } from '../lib/account-ledger-stack';
import { Stage, getEnvironmentForStage } from '../lib/environment';
// import { QldbAccountDbStack } from '../lib/qldb-account-db-stack';

const app = new App();
const account = getEnvironmentForStage(Stage.STAGING);

new AccountLedgerStack(app, 'MinhAccountLedgerStack', {
  env: { ...account },
});

// new QldbAccountDbStack(app, 'MinhQldbAccountDbStack', {
//   env: { ...account },
//   ledgerName: 'MinhAccount',
// });
