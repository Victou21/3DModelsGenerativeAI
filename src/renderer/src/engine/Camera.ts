import {
  ArcRotateCamera,
  Scene,
  Vector3
} from '@babylonjs/core'

/**
 * Camera — wraps ArcRotateCamera with sensible defaults for an editor.
 * Handles orbit, zoom and pan.
 */
export class Camera {
  private camera: ArcRotateCamera

  constructor(scene: Scene, canvas: HTMLCanvasElement) {
    this.camera = new ArcRotateCamera(
      'editorCamera',
      -Math.PI / 4,
      Math.PI / 3,
      20,
      new Vector3(8, 0, 8),
      scene
    )

    this.camera.lowerRadiusLimit = 2
    this.camera.upperRadiusLimit = 80
    this.camera.wheelPrecision = 5
    this.camera.panningSensibility = 100
    this.camera.minZ = 0.1

    this.camera.attachControl(canvas, true)
  }

  getCamera(): ArcRotateCamera {
    return this.camera
  }

  focusOn(target: Vector3): void {
    this.camera.target = target
  }

  dispose(): void {
    this.camera.dispose()
  }
}
