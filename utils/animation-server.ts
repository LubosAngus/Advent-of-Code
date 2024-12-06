import logUpdate from 'log-update'

export default class AnimationServer {
  #nextRenderTime
  #frameDuration

  constructor({ fps }: { fps: number }) {
    this.#frameDuration = 1000 / fps
  }

  renderFrame(content: string) {
    this.#setNextRenderTime()

    logUpdate(content)
  }

  #setNextRenderTime() {
    this.#nextRenderTime = Date.now() + this.#frameDuration
  }

  get isReadyForNextFrame() {
    if (this.#nextRenderTime === undefined) {
      return true
    }

    const currentTime = Date.now()

    return currentTime >= this.#nextRenderTime
  }
}
