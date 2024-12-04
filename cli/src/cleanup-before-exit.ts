export default async (): Promise<void> => {
  if (global.WATCHER && !global.WATCHER.closed) {
    await global.WATCHER.close();
  }
};
