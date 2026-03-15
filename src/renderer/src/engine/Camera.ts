import {
  ArcRotateCamera,
  Scene,
  Vector3,
  ArcRotateCameraPointersInput
} from '@babylonjs/core'

/**
 * Camera — wraps ArcRotateCamera configured for editor use.
 * Left-click is reserved for tools.
 * Middle-click = orbit, Right-click = pan, Scroll = zoom.
 */
export class Camera {
  private camera: ArcRotateCamera

  constructor(scene: Scene, canvas: HTMLCanvasElement) {
    this.camera = new ArcRotateCamera(
      'editorCamera',
      -Math.PI / 4,
      Math.PI / 3,
      24,
      new Vector3(16, 0, 16),
      scene
    )

    this.camera.lowerRadiusLimit = 2
    this.camera.upperRadiusLimit = 100
    this.camera.wheelPrecision = 5
    this.camera.panningSensibility = 80
    this.camera.minZ = 0.1
    this.camera.panningAxis = new Vector3(1, 0, 1)

    // Remap mouse buttons: middle=orbit, right=pan (frees left-click for tools)
    const pointers = this.camera.inputs.attached['pointers'] as ArcRotateCameraPointersInput
    pointers.buttons = [1, 2] // [orbit button, pan button] — 1=middle, 2=right

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
