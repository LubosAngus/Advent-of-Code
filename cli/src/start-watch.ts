import getFolderPath from '@advent-cli/src/get-folder-path'
import printHeader from '@advent-cli/src/print-header'
import runScript from '@advent-cli/src/run-script'
import chokidar from 'chokidar'

export default async (): Promise<void> => {
  const folderPath = getFolderPath()

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

  printHeader(true)
}
