import AWS from "aws-sdk";
import { Context } from "aws-lambda";

interface HandlerParameters {
  InstanceIds: string[];
}

const ec2 = new AWS.EC2({ apiVersion: "2016-11-15" });

export const handler = async (
  event: HandlerParameters,
  context: Context
): Promise<void | Error> => {
  console.log(`event : ${JSON.stringify(event, null, 2)}`);

  await ec2
    .describeInstances(event, (err, data) => {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data); // successful response
    })
    .promise();

  return;
};
