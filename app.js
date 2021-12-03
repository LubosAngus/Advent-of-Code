import { readdirSync } from 'fs'
import prompts from 'prompts'
import { exec } from 'child_process'
import watch from 'node-watch'
import open from 'open'

let askingSubmit = false
let finalResult = false
let watcher = false

const clear = () => {
  // console.clear()
  console.log('\x1Bc')
}

const getYears = () => {
  return readdirSync(process.cwd(), { withFileTypes: true })
  .filter(file => file.isDirectory() && /\d{4}/.exec(file.name))
  .map(file => ({ title: file.name, value: file.name }))
  .sort((a, b) => b.title - a.title)
}

const getDays = (year) => {
  return readdirSync(`${process.cwd()}/${year}`, { withFileTypes: true })
  .filter(file => file.isDirectory() && file.name !== '00' && /\d{2}/.exec(file.name))
  .map(file => ({ title: file.name, value: file.name }))
  .sort((a, b) => b.title - a.title)
}

const getScriptsInDay = (prev, values) => {
  return readdirSync(`${process.cwd()}/${values.year}/${values.day}`, { withFileTypes: true })
  .filter(file => /\.js$/.exec(file.name))
  .map(file => ({ title: file.name, value: file.name }))
  .sort((a, b) => b.title[0] - a.title[0])
}

const askSubmit = (config) => {
  askingSubmit = true

  prompts([
    {
      type: 'confirm',
      name: 'submit',
      message: `Submit result?`,
      initial: false
    }
  ], { onCancel: () => process.exit() }).then((res) => {
    if (res.submit) {
      open(`https://adventofcode.com/${config.year}/day/${parseInt(config.day)}?result=${finalResult}`)

      clear()
      console.log(`\n\x1b[32mSubmitting day ${config.day} of year ${config.year} with result: \x1b[0m\x1b[45m${finalResult}\x1b[0m\n`)

      if (config.watch && watcher) {
        watcher.close()
      }

      prompts([
        {
          type: 'confirm',
          name: 'commitChanges',
          message: `Commit and push changes?`,
          initial: false
        }
      ], { onCancel: () => process.exit() }).then((res) => {
        if (!res.commitChanges) {
          process.exit()
        }

        const commitMessage = `${config.year} - day ${parseInt(config.day)} - part ${config.script.replace('.js', '')}`

        exec(`git add ${config.year}/${config.day} && git commit -m "${commitMessage}" && git push`, (error, stdout, stderr) => {
          console.log(stdout)

          if (error) {
            console.log(`\n\x1b[31mERROR:\n\n${error.message}\x1b[0m\n`)
          }

          if (stderr) {
            console.log(`\n\x1b[31mSTDERR:\n\n${stderr}\x1b[0m\n`)
          }

          process.exit()
        })
      })
    }

    askingSubmit = false
  })
}

const execute = (config) => {
  let infoMsg = ''

  if (config.watch) {
    infoMsg += `\x1b[46m\x1b[30m\x1b[1m Watching ${config.year}-${config.day}-${config.script.replace('.js', '')} \x1b[0m\n`
  }

  infoMsg += `\x1b[2m\x1b[36mYou can submit result by pressing \x1b[0m\x1b[36m\x1b[1mY\x1b[0m\n`

  if (!askingSubmit) {
    askSubmit(config)
  }

  clear()
  console.log(infoMsg)
  console.log(`\x1b[7m Running \x1b[0m\n`)

  exec(`cd ${config.year}/${config.day} && node ${config.script}`, (error, stdout, stderr) => {
    clear()
    console.log(infoMsg)
    console.log(stdout)

    if (error) {
      console.log(`\n\x1b[31mERROR:\n\n${error.message}\x1b[0m\n`)
      return
    }

    if (stderr) {
      console.log(`\n\x1b[31mSTDERR:\n\n${stderr}\x1b[0m\n`)
      return
    }

    finalResult = JSON.parse(JSON.stringify(/Your result is: (.*)/m.exec(stdout)[1]).replace(/\\u001b\[0m\\u001b\[45m(.*)\\u001b\[0m/, '$1'))
  })
}

(async () => {
  clear()

  const config = await prompts([
    {
      type: 'select',
      name: 'year',
      message: 'Which year?',
      choices: getYears()
    },
    {
      type: 'select',
      name: 'day',
      message: 'Which day?',
      choices: (prev) => getDays(prev)
    },
    {
      type: 'select',
      name: 'script',
      message: 'Which script?',
      choices: (prev, values) => getScriptsInDay(prev, values)
    },
    {
      type: 'confirm',
      name: 'watch',
      message: 'Watch?',
      initial: true
    }
  ])

  if (!config.year || !config.day || !config.script) {
    console.error("\x1b[45m Ain't no script to run \x1b[0m\n")
    return
  }

  askSubmit(config)
  execute(config)

  if (config.watch) {
    watcher = watch(`./${config.year}/${config.day}/${config.script}`, {}, function() {
      execute(config)
    })
  }
})()
