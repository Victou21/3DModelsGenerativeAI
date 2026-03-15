import { Command } from './commands/Command'

/**
 * UndoRedoStack — manages the history of reversible commands.
 * Executing a new command clears the redo stack (standard editor behaviour).
 */
export class UndoRedoStack {
  private undoStack: Command[] = []
  private redoStack: Command[] = []
  private readonly maxSize: number

  onHistoryChange?: (canUndo: boolean, canRedo: boolean) => void

  constructor(maxSize = 200) {
    this.maxSize = maxSize
  }

  execute(command: Command): void {
    command.execute()
    this.undoStack.push(command)
    this.redoStack = []

    if (this.undoStack.length > this.maxSize) {
      this.undoStack.shift()
    }

    this.notify()
  }

  undo(): void {
    const command = this.undoStack.pop()
    if (!command) return
    command.undo()
    this.redoStack.push(command)
    this.notify()
  }

  redo(): void {
    const command = this.redoStack.pop()
    if (!command) return
    command.execute()
    this.undoStack.push(command)
    this.notify()
  }

  canUndo(): boolean {
    return this.undoStack.length > 0
  }

  canRedo(): boolean {
    return this.redoStack.length > 0
  }

  clear(): void {
    this.undoStack = []
    this.redoStack = []
    this.notify()
  }

  private notify(): void {
    this.onHistoryChange?.(this.canUndo(), this.canRedo())
  }
}
