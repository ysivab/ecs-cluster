import { Construct } from 'constructs';
export interface EcsClusterStackProps {
    appName: string;
}
export declare class EcsCluster extends Construct {
    constructor(scope: Construct, id: string, props: EcsClusterStackProps);
}
