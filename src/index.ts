import { Construct } from 'constructs';
import { aws_iam as iam } from 'aws-cdk-lib';
import { aws_ssm as ssm } from 'aws-cdk-lib';
import { aws_ecs as ecs } from 'aws-cdk-lib';
import { aws_ec2 as ec2 } from 'aws-cdk-lib';

export interface EcsClusterStackProps {
  appName: string;
}

export class EcsCluster extends Construct {
  constructor(scope: Construct, id: string, props: EcsClusterStackProps) {
    super(scope, id);

    const appName = props.appName;

    new iam.Role(this, 'AdminRole', {
      roleName: `role-${appName}ClusterAdmin`,
      assumedBy: new iam.AccountRootPrincipal()
    });

    const vpcId = ssm.StringParameter.fromStringParameterAttributes(this, 'vpcid', {
      parameterName: `/network/vpc_id`
    }).stringValue;

    const az1 = ssm.StringParameter.fromStringParameterAttributes(this, 'az1', {
      parameterName: `/network/az1`
    }).stringValue;

    const az2 = ssm.StringParameter.fromStringParameterAttributes(this, 'az2', {
      parameterName: `/network/az2`
    }).stringValue;

    const pubsub1 = ssm.StringParameter.fromStringParameterAttributes(this, 'pubsub1', {
      parameterName: `/network/pubsub1`
    }).stringValue;

    const pubsub2 = ssm.StringParameter.fromStringParameterAttributes(this, 'pubsub2', {
      parameterName: `/network/pubsub2`
    }).stringValue;

    const prisub1 = ssm.StringParameter.fromStringParameterAttributes(this, 'prisub1', {
      parameterName: `/network/prisub1`
    }).stringValue;

    const prisub2 = ssm.StringParameter.fromStringParameterAttributes(this, 'prisub2', {
      parameterName: `/network/prisub2`
    }).stringValue;

    const vpc = ec2.Vpc.fromVpcAttributes(this, "VPC", {
      vpcId: vpcId,
      availabilityZones: [
        az1,
        az2
      ],
      publicSubnetIds: [
        pubsub1,
        pubsub2
      ],
      privateSubnetIds: [
        prisub1,
        prisub2
      ]
    });

    const cluster = new ecs.Cluster(this, "ecs-cluster", {
      vpc: vpc,
      clusterName: `cluster-${appName}`
    });

    new ssm.StringParameter(this, 'cluster-arn', {
      description: `ECS Cluster ARN`,
      parameterName: `/ecs/clusterarn`,
      stringValue: cluster.clusterArn
    });
  }
}