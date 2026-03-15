/**
 * Command — abstract base for every reversible editor action.
 * Every tool interaction produces a Command that can be executed and undone.
 */
export abstract class Command {
  abstract execute(): void
  abstract undo(): void
}
