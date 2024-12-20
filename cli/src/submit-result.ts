import askUserCommitChanges from '@advent-cli/src/ask-user-commit-changes'
import assignStars from '@advent-cli/src/assign-stars'
import submitExistingAnswer from '@advent-cli/src/submit-existing-answer'
import submitNewAnswer from '@advent-cli/src/submit-new-answer'

export default async function (result: string): Promise<void> {
  let isResultCorrect = false

  if (global.hasStarCurrentPart) {
    isResultCorrect = await submitExistingAnswer(result)
  } else {
    isResultCorrect = await submitNewAnswer(result)
  }

  if (!isResultCorrect) {
    return
  }

  if (!global.hasStarCurrentPart) {
    await assignStars()
  }

  await askUserCommitChanges()
}
