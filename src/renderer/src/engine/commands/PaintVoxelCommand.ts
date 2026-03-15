import { Command } from './Command'
import { VoxelGrid } from '../VoxelGrid'
import { VoxelRenderer } from '../VoxelRenderer'

export class PaintVoxelCommand extends Command {
  private previousColor: string | undefined

  constructor(
    private readonly grid: VoxelGrid,
    private readonly renderer: VoxelRenderer,
    private readonly x: number,
    private readonly y: number,
    private readonly z: number,
    private readonly newColor: string
  ) {
    super()
  }

  execute(): void {
    this.previousColor = this.grid.get(this.x, this.y, this.z)?.color
    this.grid.set(this.x, this.y, this.z, { color: this.newColor })
    this.renderer.updateVoxelColor(this.x, this.y, this.z, this.newColor)
  }

  undo(): void {
    if (!this.previousColor) return
    this.grid.set(this.x, this.y, this.z, { color: this.previousColor })
    this.renderer.updateVoxelColor(this.x, this.y, this.z, this.previousColor)
  }
}
