import { PickingInfo } from '@babylonjs/core'
import { Tool, ToolContext } from './Tool'

/**
 * PaintTool — recolors an existing voxel.
 */
export class PaintTool extends Tool {
  readonly name = 'paint'
  private isDown = false

  onPointerDown(pick: PickingInfo, ctx: ToolContext): void {
    this.isDown = true
    this.paint(pick, ctx)
  }

  onPointerMove(pick: PickingInfo, ctx: ToolContext): void {
    if (this.isDown) this.paint(pick, ctx)
  }

  onPointerUp(_pick: PickingInfo, _ctx: ToolContext): void {
    this.isDown = false
  }

  private paint(pick: PickingInfo, ctx: ToolContext): void {
    if (!pick.hit || !pick.pickedPoint || !pick.getNormal) return

    const normal = pick.getNormal(true)
    if (!normal) return

    const worldPos = pick.pickedPoint.subtract(normal.scale(0.5))
    const x = Math.floor(worldPos.x)
    const y = Math.floor(worldPos.y)
    const z = Math.floor(worldPos.z)

    const existing = ctx.grid.get(x, y, z)
    if (!existing) return

    existing.color = ctx.activeColor
    ctx.renderer.updateVoxelColor(x, y, z, ctx.activeColor)
  }
}
