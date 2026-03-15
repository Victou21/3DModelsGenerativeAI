import {
  Scene,
  Mesh,
  StandardMaterial,
  Color3,
  MeshBuilder,
  TransformNode
} from '@babylonjs/core'
import { VoxelGrid } from './VoxelGrid'

/**
 * VoxelRenderer — converts VoxelGrid data into Babylon.js meshes.
 * Uses individual meshes per voxel for v0 (instancing can be added in v1).
 * Each color gets its own material, cached and reused.
 */
export class VoxelRenderer {
  private scene: Scene
  private root: TransformNode
  private meshMap: Map<string, Mesh> = new Map()
  private materialCache: Map<string, StandardMaterial> = new Map()

  constructor(scene: Scene) {
    this.scene = scene
    this.root = new TransformNode('voxelRoot', scene)
  }

  private getMaterial(hex: string): StandardMaterial {
    if (this.materialCache.has(hex)) return this.materialCache.get(hex)!

    const mat = new StandardMaterial(`mat_${hex}`, this.scene)
    mat.diffuseColor = Color3.FromHexString(hex)
    mat.specularColor = new Color3(0.1, 0.1, 0.1)
    this.materialCache.set(hex, mat)
    return mat
  }

  private voxelKey(x: number, y: number, z: number): string {
    return `${x},${y},${z}`
  }

  addVoxel(x: number, y: number, z: number, color: string): void {
    const key = this.voxelKey(x, y, z)
    if (this.meshMap.has(key)) this.removeVoxel(x, y, z)

    const mesh = MeshBuilder.CreateBox(`voxel_${key}`, { size: 1 }, this.scene)
    mesh.position.set(x + 0.5, y + 0.5, z + 0.5)
    mesh.material = this.getMaterial(color)
    mesh.parent = this.root
    this.meshMap.set(key, mesh)
  }

  removeVoxel(x: number, y: number, z: number): void {
    const key = this.voxelKey(x, y, z)
    const mesh = this.meshMap.get(key)
    if (mesh) {
      mesh.dispose()
      this.meshMap.delete(key)
    }
  }

  updateVoxelColor(x: number, y: number, z: number, color: string): void {
    const key = this.voxelKey(x, y, z)
    const mesh = this.meshMap.get(key)
    if (mesh) mesh.material = this.getMaterial(color)
  }

  rebuildFromGrid(grid: VoxelGrid): void {
    this.clear()
    for (const [pos, data] of grid.entries()) {
      this.addVoxel(pos.x, pos.y, pos.z, data.color)
    }
  }

  getAllMeshes(): Mesh[] {
    return Array.from(this.meshMap.values())
  }

  clear(): void {
    for (const mesh of this.meshMap.values()) mesh.dispose()
    this.meshMap.clear()
  }

  dispose(): void {
    this.clear()
    for (const mat of this.materialCache.values()) mat.dispose()
    this.materialCache.clear()
    this.root.dispose()
  }
}
