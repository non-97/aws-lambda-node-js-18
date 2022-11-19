import { setTimeout } from "timers/promises";

console.log(`Node.js version : ${process.version}`);

console.log(`Start setTimeout outside of handler : ${new Date()}`);
await setTimeout(1000);
console.log(`End setTimeout outside of handler : ${new Date()}`);

export const handler = async (): Promise<void | Error> => {
  console.log(`Start setTimeout inside of handler : ${new Date()}`);
  await setTimeout(2000);
  console.log(`End setTimeout inside of handler : ${new Date()}`);

  return;
};
