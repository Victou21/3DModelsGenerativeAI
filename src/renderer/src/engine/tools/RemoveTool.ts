import { PickingInfo } from '@babylonjs/core'
import { Tool, ToolContext } from './Tool'

/**
 * RemoveTool — removes the voxel that was clicked.
 */
export class RemoveTool extends Tool {
  readonly name = 'remove'
  private isDown = false

  onPointerDown(pick: PickingInfo, ctx: ToolContext): void {
    this.isDown = true
    this.erase(pick, ctx)
  }

  onPointerMove(pick: PickingInfo, ctx: ToolContext): void {
    if (this.isDown) this.erase(pick, ctx)
  }

  onPointerUp(_pick: PickingInfo, _ctx: ToolContext): void {
    this.isDown = false
  }

  private erase(pick: PickingInfo, ctx: ToolContext): void {
    if (!pick.hit || !pick.pickedPoint || !pick.getNormal) return

    const normal = pick.getNormal(true)
    if (!normal) return

    // Step slightly inside the face to find the clicked voxel
    const worldPos = pick.pickedPoint.subtract(normal.scale(0.5))
    const x = Math.floor(worldPos.x)
    const y = Math.floor(worldPos.y)
    const z = Math.floor(worldPos.z)

    if (!ctx.grid.has(x, y, z)) return

    ctx.grid.remove(x, y, z)
    ctx.renderer.removeVoxel(x, y, z)
  }
}
