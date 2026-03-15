import { Command } from './Command'
import { VoxelGrid } from '../VoxelGrid'
import { VoxelRenderer } from '../VoxelRenderer'

export class AddVoxelCommand extends Command {
  constructor(
    private readonly grid: VoxelGrid,
    private readonly renderer: VoxelRenderer,
    private readonly x: number,
    private readonly y: number,
    private readonly z: number,
    private readonly color: string
  ) {
    super()
  }

  execute(): void {
    this.grid.set(this.x, this.y, this.z, { color: this.color })
    this.renderer.addVoxel(this.x, this.y, this.z, this.color)
  }

  undo(): void {
    this.grid.remove(this.x, this.y, this.z)
    this.renderer.removeVoxel(this.x, this.y, this.z)
  }
}
