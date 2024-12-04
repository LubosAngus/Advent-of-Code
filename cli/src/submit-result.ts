import assignStars from "@advent-cli-src/assign-stars";
import askUserCommitChanges from "./ask-user-commit-changes";
import submitNewAnswer from "./submit-new-answer";

export default async function (result: string): Promise<void> {
  const submitResult = await submitNewAnswer(result);

  if (!submitResult) {
    return;
  }

  await assignStars();
  await askUserCommitChanges();
}
