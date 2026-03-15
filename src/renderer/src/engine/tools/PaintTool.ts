import { PickingInfo } from '@babylonjs/core'
import { Tool, ToolContext } from './Tool'
import { Command } from '../commands/Command'
import { PaintVoxelCommand } from '../commands/PaintVoxelCommand'

export class PaintTool extends Tool {
  readonly name = 'paint'
  private isDown = false

  onPointerDown(pick: PickingInfo, ctx: ToolContext): Command | null {
    this.isDown = true
    return this.buildCommand(pick, ctx)
  }

  onPointerMove(pick: PickingInfo, ctx: ToolContext): Command | null {
    return this.isDown ? this.buildCommand(pick, ctx) : null
  }

  onPointerUp(_pick: PickingInfo, _ctx: ToolContext): void {
    this.isDown = false
  }

  private buildCommand(pick: PickingInfo, ctx: ToolContext): Command | null {
    if (!pick.hit || !pick.pickedPoint || !pick.getNormal) return null

    const normal = pick.getNormal(true)
    if (!normal) return null

    const worldPos = pick.pickedPoint.subtract(normal.scale(0.5))
    const x = Math.floor(worldPos.x)
    const y = Math.floor(worldPos.y)
    const z = Math.floor(worldPos.z)

    const existing = ctx.grid.get(x, y, z)
    if (!existing || existing.color === ctx.activeColor) return null

    return new PaintVoxelCommand(ctx.grid, ctx.renderer, x, y, z, ctx.activeColor)
  }
}
