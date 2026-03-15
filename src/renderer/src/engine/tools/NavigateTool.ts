import { PickingInfo } from '@babylonjs/core'
import { Tool, ToolContext } from './Tool'
import { Command } from '../commands/Command'

/**
 * NavigateTool — dedicated camera navigation mode.
 * Left drag = orbit (handled directly by Camera via left button remap).
 * No block placement ever occurs in this mode.
 */
export class NavigateTool extends Tool {
  readonly name = 'navigate'

  onPointerDown(_pick: PickingInfo, _ctx: ToolContext): Command | null { return null }
  onPointerMove(_pick: PickingInfo, _ctx: ToolContext): Command | null { return null }
  onPointerUp(_pick: PickingInfo, _ctx: ToolContext): void {}
}
