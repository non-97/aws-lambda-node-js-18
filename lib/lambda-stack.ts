import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "path";

export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaIamRole = new cdk.aws_iam.Role(
      this,
      "Lambda Function IAM Role",
      {
        assumedBy: new cdk.aws_iam.ServicePrincipal("lambda.amazonaws.com"),
        managedPolicies: [
          cdk.aws_iam.ManagedPolicy.fromAwsManagedPolicyName(
            "service-role/AWSLambdaBasicExecutionRole"
          ),
        ],
      }
    );

    const ec2ReadOnlyLambdaIamRole = new cdk.aws_iam.Role(
      this,
      "EC2 ReadOnly Lambda Function IAM Role",
      {
        assumedBy: new cdk.aws_iam.ServicePrincipal("lambda.amazonaws.com"),
        managedPolicies: [
          cdk.aws_iam.ManagedPolicy.fromAwsManagedPolicyName(
            "service-role/AWSLambdaBasicExecutionRole"
          ),
          cdk.aws_iam.ManagedPolicy.fromAwsManagedPolicyName(
            "AmazonEC2ReadOnlyAccess"
          ),
        ],
      }
    );

    new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      "Node.js 18 Lambda Function",
      {
        entry: path.join(
          __dirname,
          "../src/lambda/handlers/node-js-18-handler.ts"
        ),
        runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
        bundling: {
          minify: true,
          sourceMap: true,
          tsconfig: path.join(__dirname, "../src/lambda/tsconfig.json"),
          format: cdk.aws_lambda_nodejs.OutputFormat.ESM,
        },
        architecture: cdk.aws_lambda.Architecture.ARM_64,
        role: lambdaIamRole,
        logRetention: cdk.aws_logs.RetentionDays.TWO_WEEKS,
        tracing: cdk.aws_lambda.Tracing.ACTIVE,
        timeout: cdk.Duration.seconds(10),
      }
    );

    new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      "AWS SDK for JavaScript v3 Lambda Function",
      {
        entry: path.join(
          __dirname,
          "../src/lambda/handlers/aws-sdk-js-v3-handler.ts"
        ),
        runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
        bundling: {
          minify: true,
          sourceMap: true,
          externalModules: ["@aws-sdk/*"],
          tsconfig: path.join(__dirname, "../src/lambda/tsconfig.json"),
          format: cdk.aws_lambda_nodejs.OutputFormat.ESM,
        },
        architecture: cdk.aws_lambda.Architecture.ARM_64,
        role: ec2ReadOnlyLambdaIamRole,
        logRetention: cdk.aws_logs.RetentionDays.TWO_WEEKS,
        tracing: cdk.aws_lambda.Tracing.ACTIVE,
        timeout: cdk.Duration.seconds(10),
      }
    );

    new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      "AWS SDK for JavaScript v2 Lambda Function",
      {
        entry: path.join(
          __dirname,
          "../src/lambda/handlers/aws-sdk-js-v2-handler.ts"
        ),
        runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
        bundling: {
          minify: true,
          sourceMap: true,
          externalModules: [],
          tsconfig: path.join(__dirname, "../src/lambda/tsconfig.json"),
          format: cdk.aws_lambda_nodejs.OutputFormat.CJS,
        },
        architecture: cdk.aws_lambda.Architecture.ARM_64,
        role: ec2ReadOnlyLambdaIamRole,
        logRetention: cdk.aws_logs.RetentionDays.TWO_WEEKS,
        tracing: cdk.aws_lambda.Tracing.ACTIVE,
        timeout: cdk.Duration.seconds(10),
        memorySize: 256,
      }
    );
  }
}
