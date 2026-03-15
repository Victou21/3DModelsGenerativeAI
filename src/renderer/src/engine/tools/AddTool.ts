import { PickingInfo, Vector3 } from '@babylonjs/core'
import { Tool, ToolContext } from './Tool'

/**
 * AddTool — places a voxel adjacent to the face that was clicked.
 */
export class AddTool extends Tool {
  readonly name = 'add'
  private isDown = false

  onPointerDown(pick: PickingInfo, ctx: ToolContext): void {
    this.isDown = true
    this.place(pick, ctx)
  }

  onPointerMove(pick: PickingInfo, ctx: ToolContext): void {
    if (this.isDown) this.place(pick, ctx)
  }

  onPointerUp(_pick: PickingInfo, _ctx: ToolContext): void {
    this.isDown = false
  }

  private place(pick: PickingInfo, ctx: ToolContext): void {
    if (!pick.hit || !pick.pickedPoint || !pick.getNormal) return

    const normal = pick.getNormal(true)
    if (!normal) return

    // Step slightly outside the face to find the new voxel position
    const worldPos = pick.pickedPoint.add(normal.scale(0.5))
    const x = Math.floor(worldPos.x)
    const y = Math.floor(worldPos.y)
    const z = Math.floor(worldPos.z)

    if (ctx.grid.has(x, y, z)) return

    ctx.grid.set(x, y, z, { color: ctx.activeColor })
    ctx.renderer.addVoxel(x, y, z, ctx.activeColor)
  }
}
