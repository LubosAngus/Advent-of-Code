import assignStars from "@advent-cli-src/assign-stars";
import commitAndPush from "./commit-and-push";
import submitNewAnswer from "./submit-new-answer";

export default async function (result: string): Promise<void> {
  const submitResult = await submitNewAnswer(result);

  if (!submitResult) {
    return;
  }

  await assignStars();
  await commitAndPush();
}
