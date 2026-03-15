import { Scene } from '@babylonjs/core'
import { GLTF2Export } from '@babylonjs/serializers/glTF'

/**
 * Exporter — handles serializing the current scene to a file.
 * Currently supports GLB (binary glTF), the most portable 3D format.
 */
export class Exporter {
  private scene: Scene

  constructor(scene: Scene) {
    this.scene = scene
  }

  async exportGLB(filename: string = 'forge-model'): Promise<void> {
    const glb = await GLTF2Export.GLBAsync(this.scene, filename, {
      shouldExportNode: (node) => node.name.startsWith('voxel_')
    })
    glb.downloadFiles()
  }
}
