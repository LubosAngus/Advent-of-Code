/**
 *
 * Adds new buttons to navigation
 *
 */
const addHeaderRow = () => {
  const header = document.querySelector("header")
  const divRow = document.createElement("div")
  divRow.innerHTML = `
    <h1 class="title-event">
      <span class="title-event-wrap">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0x1A4</span>
    </h1>
    <nav>
      <ul class="js-custom-buttons"></ul>
    </nav>
  `

  header.append(divRow)
}

const addNavButton = ({ name, href }) => {
  if (!document.querySelector(".js-custom-buttons")) {
    addHeaderRow()
  }

  const navUlEl = document.querySelector(".js-custom-buttons")
  const year = /^\/?(\d{4})\/?/.exec(window.location.pathname)?.[1]

  const li = document.createElement("li")
  li.innerHTML = `<a href="${year ? `/${year}` : ""}${href}">[${name}]</a>`

  navUlEl.append(li)
}

addNavButton({
  name: "Moje",
  href: "/leaderboard/private/view/477729",
})
addNavButton({
  name: "Milankove",
  href: "/leaderboard/private/view/422351",
})
addNavButton({
  name: "Filipkove",
  href: "/leaderboard/private/view/1604504",
})

/**
 *
 * Submits an answer from url parameter
 * just pass ?result=RESULT and it would be submitted
 *
 */
const submitAnswerFromUrl = () => {
  if (!document.querySelector("form")) return

  const result = new URLSearchParams(window.location.search).get("result")

  if (result !== null) {
    document.querySelector('input[name="answer"]').value = result
    document.querySelector("form").submit()
  }
}
submitAnswerFromUrl()
