export interface VoxelData {
  color: string
}

export interface VoxelPosition {
  x: number
  y: number
  z: number
}

/**
 * VoxelGrid — stores voxel data as a flat Map keyed by "x,y,z".
 * Pure data structure, no rendering logic.
 */
export class VoxelGrid {
  private cells: Map<string, VoxelData> = new Map()
  readonly size: number

  constructor(size: number = 32) {
    this.size = size
  }

  private key(x: number, y: number, z: number): string {
    return `${x},${y},${z}`
  }

  set(x: number, y: number, z: number, data: VoxelData): void {
    if (!this.inBounds(x, y, z)) return
    this.cells.set(this.key(x, y, z), data)
  }

  get(x: number, y: number, z: number): VoxelData | undefined {
    return this.cells.get(this.key(x, y, z))
  }

  remove(x: number, y: number, z: number): boolean {
    return this.cells.delete(this.key(x, y, z))
  }

  has(x: number, y: number, z: number): boolean {
    return this.cells.has(this.key(x, y, z))
  }

  inBounds(x: number, y: number, z: number): boolean {
    return (
      x >= 0 && x < this.size &&
      y >= 0 && y < this.size &&
      z >= 0 && z < this.size
    )
  }

  count(): number {
    return this.cells.size
  }

  clear(): void {
    this.cells.clear()
  }

  entries(): Array<[VoxelPosition, VoxelData]> {
    return Array.from(this.cells.entries()).map(([key, data]) => {
      const [x, y, z] = key.split(',').map(Number)
      return [{ x, y, z }, data]
    })
  }
}
