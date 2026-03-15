import { Scene, MeshBuilder, Vector3 } from '@babylonjs/core'
import { MeshObject, PrimitiveType } from './MeshObject'

let counter = 0
const nextId = () => `mesh_${Date.now()}_${counter++}`

/**
 * PrimitiveFactory — creates MeshObjects from a PrimitiveType.
 * Each primitive is spawned slightly above the grid center.
 */
export class PrimitiveFactory {
  private scene: Scene

  constructor(scene: Scene) {
    this.scene = scene
  }

  create(type: PrimitiveType): MeshObject {
    const id = nextId()
    const name = `${type.charAt(0).toUpperCase() + type.slice(1)}`
    const spawnPos = new Vector3(16, 1, 16)

    const mesh = (() => {
      switch (type) {
        case 'box':
          return MeshBuilder.CreateBox(id, { size: 2 }, this.scene)
        case 'sphere':
          return MeshBuilder.CreateSphere(id, { diameter: 2, segments: 16 }, this.scene)
        case 'cylinder':
          return MeshBuilder.CreateCylinder(id, { height: 2, diameter: 1.5, tessellation: 24 }, this.scene)
        case 'plane':
          return MeshBuilder.CreatePlane(id, { size: 2, sideOrientation: 2 }, this.scene)
        case 'cone':
          return MeshBuilder.CreateCylinder(id, { height: 2, diameterTop: 0, diameterBottom: 1.5, tessellation: 24 }, this.scene)
        case 'torus':
          return MeshBuilder.CreateTorus(id, { diameter: 2, thickness: 0.5, tessellation: 32 }, this.scene)
      }
    })()

    mesh.position = spawnPos.clone()

    return new MeshObject(id, name, type, mesh, this.scene)
  }
}
