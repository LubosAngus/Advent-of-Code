/**
 *
 * Submits an answer from url parameter
 * just pass ?result=RESULT and it would be submitted
 *
 */
const submitAnswerFromUrl = () => {
  if (!document.querySelector('form')) return

  const result = new URLSearchParams(window.location.search).get('result')

  if (result !== null) {
    document.querySelector('input[name="answer"]').value = result
    document.querySelector('form').submit()
  }
}
submitAnswerFromUrl()