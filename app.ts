import { readdirSync } from "fs"
import prompts from "prompts"
import { exec } from "child_process"
import watch, { type Watcher } from "node-watch"
import open from "open"

let askingSubmit = false
let finalResult: string | boolean = false
let watcher: Watcher | false = false

/**
 * Clears the console output
 */
const clearConsole = (): void => {
  console.log("\x1Bc")
}

/**
 * Get the list of year directories (folders that match the four-digit year pattern).
 */
const getYears = (): Array<{
  title: string
  value: string
}> =>
  readdirSync(process.cwd(), { withFileTypes: true })
    .filter((file) => file.isDirectory() && /\d{4}/.test(file.name))
    .map((file) => ({ title: file.name, value: file.name }))
    .sort((a, b) => Number(b.title) - Number(a.title))

/**
 * Get the list of days within a specific year (folders that match the two-digit day pattern).
 */
const getDays = (
  year: string,
): Array<{
  title: string
  value: string
}> =>
  readdirSync(`${process.cwd()}/${year}`, { withFileTypes: true })
    .filter(
      (file) =>
        file.isDirectory() && file.name !== "00" && /\d{2}/.test(file.name),
    )
    .map((file) => ({ title: file.name, value: file.name }))
    .sort((a, b) => Number(b.title) - Number(a.title))

/**
 * Get the list of script files within a specific day folder.
 */
const getScriptsInDay = (values: {
  year: string
  day: string
}): Array<{ title: string; value: string }> =>
  readdirSync(`${process.cwd()}/${values.year}/${values.day}`, {
    withFileTypes: true,
  })
    .filter((file) => /(\.js$)|(\.ts$)/.test(file.name))
    .map((file) => ({ title: file.name, value: file.name }))
    .sort((a, b) => a.title.localeCompare(b.title)) // Using localeCompare for string comparison

/**
 * Asks the user whether to submit the result, commit and push changes if confirmed.
 */
const askSubmit = (config: {
  year: string
  day: string
  script: string
  watch: boolean
}): void => {
  askingSubmit = true

  prompts(
    [
      {
        type: "confirm",
        name: "submit",
        message: "Submit result?",
        initial: false,
      },
    ],
    {
      onCancel: () => process.exit(),
    },
  ).then(async (res) => {
    if (res.submit) {
      open(
        `https://adventofcode.com/${config.year}/day/${parseInt(config.day)}?result=${finalResult}`,
      )

      clearConsole()
      console.log(
        `\n\x1b[32mSubmitting day ${config.day} of year ${config.year} with result: \x1b[0m\x1b[45m${finalResult}\x1b[0m\n`,
      )

      if (config.watch && watcher) {
        watcher.close()
      }

      const commitRes = await prompts(
        {
          type: "confirm",
          name: "commitChanges",
          message: "Commit and push changes?",
          initial: false,
        },
        {
          onCancel: () => process.exit(),
        },
      )

      if (!commitRes.commitChanges) {
        process.exit()
      }

      let commitMessage = `${config.year}`
      commitMessage += ` - day ${parseInt(config.day)}`
      commitMessage += `- part ${config.script.replace(/\.(js|ts)$/, "")}`
      execCommitPush(config.year, config.day, commitMessage)
    }

    askingSubmit = false
  })
}

/**
 * Executes the script, watches for changes if needed, and handles result parsing.
 */
const execute = (config: {
  year: string
  day: string
  script: string
  watch: boolean
}): void => {
  const infoMsg = buildInfoMessage(config)

  if (!askingSubmit) {
    askSubmit(config)
  }

  clearConsole()
  console.log(infoMsg)
  console.log(`\x1b[7m Running \x1b[0m\n`)

  exec(
    `cd ${config.year}/${config.day} && node --experimental-strip-types ${config.script}`,
    (error, stdout, stderr) => {
      clearConsole()
      console.log(infoMsg)
      console.log(stdout)

      if (error || stderr) {
        handleExecutionErrors(error, stderr)
        return
      }

      const resultMatch = stdout.match(/Your result is: (.*)/m)
      if (resultMatch) {
        finalResult = resultMatch[1].replace(
          /\\u001b\[0m\\u001b\[45m(.*)\\u001b\[0m/,
          "$1",
        )
      }
    },
  )
}

/**
 * Executes the Git commit and push commands.
 */
const execCommitPush = (
  year: string,
  day: string,
  commitMessage: string,
): void => {
  exec(
    `git add ${year}/${day} && git commit -m "${commitMessage}" && git push`,
    (error, stdout, stderr) => {
      console.log(stdout)
      if (error) {
        console.error(`\n\x1b[31mERROR:\n\n${error.message}\x1b[0m\n`)
      }
      if (stderr) {
        console.error(`\n\x1b[31mSTDERR:\n\n${stderr}\x1b[0m\n`)
      }
      process.exit()
    },
  )
}

/**
 * Builds an informative message to display during the execution.
 */
const buildInfoMessage = (config: {
  year: string
  day: string
  script: string
  watch: boolean
}): string => {
  let message = ""
  if (config.watch) {
    message += `\x1b[46m\x1b[30m\x1b[1m Watching ${config.year}-${config.day}-${config.script.replace(".js", "")} \x1b[0m\n`
  }
  message += `\x1b[2m\x1b[36mYou can submit result by pressing \x1b[0m\x1b[36m\x1b[1mY\x1b[0m\n`
  return message
}

/**
 * Handles execution errors (if any).
 */
const handleExecutionErrors = (error: Error | null, stderr: string): void => {
  if (error) {
    console.error(`\n\x1b[31mERROR:\n\n${error.message}\x1b[0m\n`)
  }
  if (stderr) {
    console.error(`\n\x1b[31mSTDERR:\n\n${stderr}\x1b[0m\n`)
  }
}

/**
 * Main function that initializes the program, asks the necessary prompts, and sets up file watchers.
 */
;(async () => {
  clearConsole()

  const config = await prompts([
    {
      type: "select",
      name: "year",
      message: "Which year?",
      choices: getYears(),
    },
    {
      type: "select",
      name: "day",
      message: "Which day?",
      choices: (prev: string) => getDays(prev),
    },
    {
      type: "select",
      name: "script",
      message: "Which script?",
      choices: (_prev, values: { year: string; day: string }) =>
        getScriptsInDay(values),
    },
    {
      type: "confirm",
      name: "watch",
      message: "Watch?",
      initial: true,
    },
  ])

  if (!config.year || !config.day || !config.script) {
    console.error("\x1b[45m Ain't no script to run \x1b[0m\n")
    return
  }

  askSubmit(config)
  execute(config)

  if (config.watch) {
    watcher = watch(
      `./${config.year}/${config.day}/${config.script}`,
      {},
      () => {
        execute(config)
      },
    )
  }
})()
