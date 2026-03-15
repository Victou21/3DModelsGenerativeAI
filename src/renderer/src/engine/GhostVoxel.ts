import {
  Scene,
  Mesh,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Color4
} from '@babylonjs/core'

/**
 * GhostVoxel — a semi-transparent preview voxel that follows the cursor.
 * Shown when the Add tool is active and hovering over a valid placement surface.
 */
export class GhostVoxel {
  private mesh: Mesh
  private material: StandardMaterial

  constructor(scene: Scene) {
    this.mesh = MeshBuilder.CreateBox('ghost', { size: 1 }, scene)
    this.mesh.isPickable = false

    this.material = new StandardMaterial('ghostMat', scene)
    this.material.diffuseColor = new Color3(1, 1, 1)
    this.material.alpha = 0.3
    this.material.backFaceCulling = false

    this.mesh.material = this.material
    this.mesh.isVisible = false
  }

  show(x: number, y: number, z: number, color: string): void {
    this.mesh.position.set(x + 0.5, y + 0.5, z + 0.5)
    this.material.diffuseColor = Color3.FromHexString(color)
    this.mesh.isVisible = true
  }

  hide(): void {
    this.mesh.isVisible = false
  }

  dispose(): void {
    this.material.dispose()
    this.mesh.dispose()
  }
}
