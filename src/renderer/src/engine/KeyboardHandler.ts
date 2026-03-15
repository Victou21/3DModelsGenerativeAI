import { ToolName } from './SceneManager'

type Callback = {
  setTool: (tool: ToolName) => void
  undo: () => void
  redo: () => void
  exportGLB: () => void
}

/**
 * KeyboardHandler — maps keyboard shortcuts to engine actions.
 * Designed to be easily extended: add new entries to the keymap.
 */
export class KeyboardHandler {
  private callbacks: Callback
  private listener: (e: KeyboardEvent) => void

  constructor(callbacks: Callback) {
    this.callbacks = callbacks

    this.listener = (e: KeyboardEvent) => {
      const isMeta = e.metaKey || e.ctrlKey

      // Don't fire shortcuts when typing in an input
      if (e.target instanceof HTMLInputElement) return

      if (isMeta && e.key === 'z' && !e.shiftKey) { e.preventDefault(); this.callbacks.undo(); return }
      if (isMeta && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); this.callbacks.redo(); return }
      if (isMeta && e.key === 'e') { e.preventDefault(); this.callbacks.exportGLB(); return }

      switch (e.key.toLowerCase()) {
        case 'a': this.callbacks.setTool('add'); break
        case 'r': this.callbacks.setTool('remove'); break
        case 'p': this.callbacks.setTool('paint'); break
      }
    }

    window.addEventListener('keydown', this.listener)
  }

  dispose(): void {
    window.removeEventListener('keydown', this.listener)
  }
}
