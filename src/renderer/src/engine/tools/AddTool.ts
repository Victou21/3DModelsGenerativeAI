import { PickingInfo } from '@babylonjs/core'
import { Tool, ToolContext } from './Tool'
import { Command } from '../commands/Command'
import { AddVoxelCommand } from '../commands/AddVoxelCommand'

export class AddTool extends Tool {
  readonly name = 'add'
  private isDown = false
  private lastKey = ''  // tracks last placed cell to avoid duplicates during drag

  onPointerDown(pick: PickingInfo, ctx: ToolContext): Command | null {
    this.isDown = true
    this.lastKey = ''
    return this.buildCommand(pick, ctx)
  }

  onPointerMove(pick: PickingInfo, ctx: ToolContext): Command | null {
    return this.isDown ? this.buildCommand(pick, ctx) : null
  }

  onPointerUp(_pick: PickingInfo, _ctx: ToolContext): void {
    this.isDown = false
    this.lastKey = ''
  }

  private buildCommand(pick: PickingInfo, ctx: ToolContext): Command | null {
    if (!pick.hit || !pick.pickedPoint || !pick.getNormal) return null

    const normal = pick.getNormal(true)
    if (!normal) return null

    const worldPos = pick.pickedPoint.add(normal.scale(0.5))
    const x = Math.floor(worldPos.x)
    const y = Math.floor(worldPos.y)
    const z = Math.floor(worldPos.z)

    // Bounds check — prevents infinite loop when clicking below/outside the grid
    if (!ctx.grid.inBounds(x, y, z)) return null

    // Already occupied
    if (ctx.grid.has(x, y, z)) return null

    // During drag, skip if we're still in the same cell
    const key = `${x},${y},${z}`
    if (key === this.lastKey) return null
    this.lastKey = key

    return new AddVoxelCommand(ctx.grid, ctx.renderer, x, y, z, ctx.activeColor)
  }
}
