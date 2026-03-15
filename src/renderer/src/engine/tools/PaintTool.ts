import { PickingInfo } from '@babylonjs/core'
import { Tool, ToolContext } from './Tool'
import { Command } from '../commands/Command'
import { PaintVoxelCommand } from '../commands/PaintVoxelCommand'

const DRAG_THROTTLE_MS = 80

export class PaintTool extends Tool {
  readonly name = 'paint'
  private isDown = false
  private lastKey = ''
  private lastPlacedAt = 0

  onPointerDown(pick: PickingInfo, ctx: ToolContext): Command | null {
    this.isDown = true
    this.lastKey = ''
    this.lastPlacedAt = 0
    return this.buildCommand(pick, ctx)
  }

  onPointerMove(pick: PickingInfo, ctx: ToolContext): Command | null {
    if (!this.isDown) return null
    if (Date.now() - this.lastPlacedAt < DRAG_THROTTLE_MS) return null
    return this.buildCommand(pick, ctx)
  }

  onPointerUp(_pick: PickingInfo, _ctx: ToolContext): void {
    this.isDown = false
    this.lastKey = ''
  }

  private buildCommand(pick: PickingInfo, ctx: ToolContext): Command | null {
    if (!pick.hit || !pick.pickedPoint || !pick.getNormal) return null

    const normal = pick.getNormal(true)
    if (!normal) return null

    const worldPos = pick.pickedPoint.subtract(normal.scale(0.5))
    const x = Math.floor(worldPos.x)
    const y = Math.floor(worldPos.y)
    const z = Math.floor(worldPos.z)

    if (!ctx.grid.inBounds(x, y, z)) return null

    const existing = ctx.grid.get(x, y, z)
    if (!existing || existing.color === ctx.activeColor) return null

    const key = `${x},${y},${z}`
    if (key === this.lastKey) return null
    this.lastKey = key
    this.lastPlacedAt = Date.now()

    return new PaintVoxelCommand(ctx.grid, ctx.renderer, x, y, z, ctx.activeColor)
  }
}
