import { Mesh, StandardMaterial, Color3, Scene, Vector3 } from '@babylonjs/core'

export type PrimitiveType = 'box' | 'sphere' | 'cylinder' | 'plane' | 'cone' | 'torus'

export interface MeshObjectData {
  id: string
  name: string
  type: PrimitiveType
}

/**
 * MeshObject — a named, selectable scene object wrapping a Babylon Mesh.
 * Owns its material so color changes are isolated per object.
 */
export class MeshObject {
  readonly id: string
  name: string
  readonly type: PrimitiveType
  readonly mesh: Mesh
  private material: StandardMaterial

  constructor(id: string, name: string, type: PrimitiveType, mesh: Mesh, scene: Scene) {
    this.id = id
    this.name = name
    this.type = type
    this.mesh = mesh

    this.material = new StandardMaterial(`mat_${id}`, scene)
    this.material.diffuseColor = new Color3(0.5, 0.7, 1.0)
    this.material.specularColor = new Color3(0.1, 0.1, 0.1)
    this.mesh.material = this.material

    // Tag mesh so SceneManager can identify it
    this.mesh.metadata = { meshObjectId: id }
  }

  setColor(hex: string): void {
    this.material.diffuseColor = Color3.FromHexString(hex)
  }

  getColor(): string {
    return this.material.diffuseColor.toHexString()
  }

  getData(): MeshObjectData {
    return { id: this.id, name: this.name, type: this.type }
  }

  dispose(): void {
    this.material.dispose()
    this.mesh.dispose()
  }
}
