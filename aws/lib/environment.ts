import * as cdk from 'aws-cdk-lib';
type Environment = Required<cdk.Environment>;

export enum Stage {
  STAGING = 'staging',
}

const stageToEnvironment: Record<Stage, Environment> = {
  [Stage.STAGING]: {
    account: '223896404705',
    region: 'eu-west-1',
  },
};

export const getEnvironmentForStage = (stage: Stage): Environment => {
  return stageToEnvironment[stage];
};
