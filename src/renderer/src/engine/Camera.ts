import {
  ArcRotateCamera,
  Scene,
  Vector3,
  ArcRotateCameraPointersInput
} from '@babylonjs/core'

/**
 * Camera — wraps ArcRotateCamera configured for editor use.
 *
 * Controls:
 *   Alt + Left drag  → orbit  (industry standard: Blender/Maya)
 *   Middle drag      → orbit  (alternative)
 *   Right drag       → pan
 *   Scroll           → zoom
 */
export class Camera {
  private camera: ArcRotateCamera
  private isAltDragging = false
  private lastX = 0
  private lastY = 0
  private readonly orbitSpeed = 0.008

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

    // Middle=orbit, Right=pan — left click stays free for tools
    const pointers = this.camera.inputs.attached['pointers'] as ArcRotateCameraPointersInput
    pointers.buttons = [1, 2]

    this.camera.attachControl(canvas, true)
    this.setupAltDrag(canvas)
  }

  /**
   * Alt + left drag to orbit — manual handler since Babylon's pointer input
   * doesn't support modifier-key bindings natively.
   */
  private setupAltDrag(canvas: HTMLCanvasElement): void {
    canvas.addEventListener('pointerdown', (e) => {
      if (e.button === 0 && e.altKey) {
        this.isAltDragging = true
        this.lastX = e.clientX
        this.lastY = e.clientY
        canvas.setPointerCapture(e.pointerId)
        e.stopPropagation()
      }
    })

    canvas.addEventListener('pointermove', (e) => {
      if (!this.isAltDragging) return
      const dx = e.clientX - this.lastX
      const dy = e.clientY - this.lastY
      this.camera.alpha -= dx * this.orbitSpeed
      this.camera.beta  = Math.max(0.1, Math.min(Math.PI - 0.1,
        this.camera.beta - dy * this.orbitSpeed
      ))
      this.lastX = e.clientX
      this.lastY = e.clientY
      e.stopPropagation()
    })

    canvas.addEventListener('pointerup', (e) => {
      if (this.isAltDragging) {
        this.isAltDragging = false
        canvas.releasePointerCapture(e.pointerId)
        e.stopPropagation()
      }
    })
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
