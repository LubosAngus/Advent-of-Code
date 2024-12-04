import assignStars from "@advent-cli/src/assign-stars";
import askUserCommitChanges from "@advent-cli/src/ask-user-commit-changes";
import submitNewAnswer from "@advent-cli/src/submit-new-answer";
import submitExistingAnswer from "@advent-cli/src/submit-existing-answer";

export default async function (result: string): Promise<void> {
  let isResultCorrect = false;

  if (global.hasStar) {
    isResultCorrect = await submitExistingAnswer(result);
  } else {
    isResultCorrect = await submitNewAnswer(result);
  }

  if (!isResultCorrect) {
    return;
  }

  if (!global.hasStar) {
    await assignStars();
  }

  await askUserCommitChanges();
}
