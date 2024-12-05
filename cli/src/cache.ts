import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { __ROOT_DIR } from './get-folder-path'

const CACHE_FILE = path.resolve(__ROOT_DIR, 'cache.json')
let cacheFileContents

async function getCacheFileContents() {
  if (cacheFileContents !== undefined) {
    return
  }

  try {
    const data = await readFile(CACHE_FILE, 'utf-8')

    cacheFileContents = JSON.parse(data)
  } catch (error) {
    // Return empty cache if file doesn't exist or is unreadable
    if (error.code === 'ENOENT') {
      cacheFileContents = {}
    }

    throw error
  }
}

export async function hasCache(key: string): Promise<boolean> {
  await getCacheFileContents()

  return typeof cacheFileContents[key] !== 'undefined'
}

export async function readCache(key: string): Promise<unknown | false> {
  await getCacheFileContents()

  const cachedValue = cacheFileContents[key]

  if (cachedValue === undefined) {
    return false
  }

  return cachedValue
}

export async function writeCache(key: string, value: string): Promise<void> {
  await getCacheFileContents()

  cacheFileContents[key] = value

  await writeFile(
    CACHE_FILE,
    JSON.stringify(cacheFileContents, null, 2),
    'utf-8',
  )
}
