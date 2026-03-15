import { Command } from './Command'
import { VoxelGrid, VoxelData } from '../VoxelGrid'
import { VoxelRenderer } from '../VoxelRenderer'

export class RemoveVoxelCommand extends Command {
  private snapshot: VoxelData | undefined

  constructor(
    private readonly grid: VoxelGrid,
    private readonly renderer: VoxelRenderer,
    private readonly x: number,
    private readonly y: number,
    private readonly z: number
  ) {
    super()
  }

  execute(): void {
    // Snapshot the voxel data before removing so undo can restore it
    this.snapshot = this.grid.get(this.x, this.y, this.z)
    this.grid.remove(this.x, this.y, this.z)
    this.renderer.removeVoxel(this.x, this.y, this.z)
  }

  undo(): void {
    if (!this.snapshot) return
    this.grid.set(this.x, this.y, this.z, this.snapshot)
    this.renderer.addVoxel(this.x, this.y, this.z, this.snapshot.color)
  }
}
