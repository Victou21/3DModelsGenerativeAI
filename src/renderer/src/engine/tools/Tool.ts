import { Scene, PickingInfo } from '@babylonjs/core'
import { VoxelGrid } from '../VoxelGrid'
import { VoxelRenderer } from '../VoxelRenderer'

export interface ToolContext {
  grid: VoxelGrid
  renderer: VoxelRenderer
  scene: Scene
  activeColor: string
}

/**
 * Tool — abstract base class for all editor tools.
 * Each tool reacts to pointer events from the SceneManager.
 */
export abstract class Tool {
  abstract readonly name: string

  abstract onPointerDown(pick: PickingInfo, ctx: ToolContext): void
  abstract onPointerMove(pick: PickingInfo, ctx: ToolContext): void
  abstract onPointerUp(pick: PickingInfo, ctx: ToolContext): void
}
