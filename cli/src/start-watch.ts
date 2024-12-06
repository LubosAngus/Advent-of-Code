import getFolderPath from '@advent-cli/src/get-folder-path'
import runScript from '@advent-cli/src/run-script'
import { exec } from 'child_process'
import chokidar from 'chokidar'
import path from 'path'

export default async (): Promise<void> => {
  const folderPath = getFolderPath()
  const currentFilePath = path.join(folderPath, global.file)

  // Only open file in vscode, if terminal is running in vscode
  exec(`printenv TERM_PROGRAM`, async (_error, stdout) => {
    stdout = stdout.replaceAll('\n', '')

    if (stdout !== 'vscode') {
      return
    }

    exec(`code ${currentFilePath}`)
  })

  // Watch for file changes
  const watcher = chokidar.watch(folderPath, {
    persistent: true,
    ignored: (file) => {
      if (file.endsWith('part2.ts') && global.part === 1) {
        return true
      }

      if (file.endsWith('part1.ts') && global.part === 2) {
        return true
      }

      return false
    },
  })

  watcher.on('change', () => {
    runScript()
  })

  global.WATCHER = watcher

  runScript(false)
}
