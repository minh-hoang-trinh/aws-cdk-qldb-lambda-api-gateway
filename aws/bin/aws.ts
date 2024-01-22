#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { AccountLedgerStack } from '../lib/account-ledger-stack';
import { Stage, getEnvironmentForStage } from '../lib/environment';

const app = new App();
const account = getEnvironmentForStage(Stage.STAGING);

new AccountLedgerStack(app, 'MinhAccountLedgerStack', {
  env: { ...account },
  ledgerName: 'MinhTestLedgerAccount',
});
