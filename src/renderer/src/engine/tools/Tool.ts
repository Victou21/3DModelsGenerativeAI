import { Scene, PickingInfo } from '@babylonjs/core'
import { VoxelGrid } from '../VoxelGrid'
import { VoxelRenderer } from '../VoxelRenderer'
import { Command } from '../commands/Command'

export interface ToolContext {
  grid: VoxelGrid
  renderer: VoxelRenderer
  scene: Scene
  activeColor: string
}

/**
 * Tool — abstract base class for all editor tools.
 * Each pointer event returns a Command (or null if no action taken).
 * The SceneManager executes and records the command in the undo stack.
 */
export abstract class Tool {
  abstract readonly name: string

  abstract onPointerDown(pick: PickingInfo, ctx: ToolContext): Command | null
  abstract onPointerMove(pick: PickingInfo, ctx: ToolContext): Command | null
  abstract onPointerUp(pick: PickingInfo, ctx: ToolContext): void

  /**
   * Called on every pointer move regardless of button state.
   * Used for hover preview — does NOT produce a command.
   */
  onHover(_pick: PickingInfo, _ctx: ToolContext): void {}
}
