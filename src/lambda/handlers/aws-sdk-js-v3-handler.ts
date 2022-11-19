import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";
import { Context } from "aws-lambda";

interface HandlerParameters {
  instanceIds: string[];
}

const ec2Client = new EC2Client({});

export const handler = async (
  event: HandlerParameters,
  context: Context
): Promise<void | Error> => {
  console.log(`event : ${JSON.stringify(event, null, 2)}`);

  await ec2Client
    .send(new DescribeInstancesCommand({ InstanceIds: event.instanceIds }))
    .then((instances) => {
      console.log(JSON.stringify(instances, null, 2));
    })
    .catch((error) => {
      console.error("Describe the EC2 Instance error!! \n\n", error);
    });

  return;
};
