import {
  ArcRotateCamera,
  Scene,
  Vector3,
  ArcRotateCameraPointersInput
} from '@babylonjs/core'

/**
 * Camera — wraps ArcRotateCamera configured for editor use.
 *
 * Normal mode:
 *   Alt + Left drag  → orbit
 *   Middle drag      → orbit
 *   Right drag       → pan
 *   Scroll           → zoom
 *
 * Navigate mode (NavigateTool active):
 *   Left drag        → orbit  (no Alt needed)
 *   Right drag       → pan
 *   Scroll           → zoom
 */
export class Camera {
  private camera: ArcRotateCamera
  private pointers: ArcRotateCameraPointersInput
  private _isAltDragging = false
  private _navigateMode = false
  private lastX = 0
  private lastY = 0
  private readonly orbitSpeed = 0.008
  private canvas: HTMLCanvasElement

  constructor(scene: Scene, canvas: HTMLCanvasElement) {
    this.canvas = canvas

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

    this.pointers = this.camera.inputs.attached['pointers'] as ArcRotateCameraPointersInput
    this.pointers.buttons = [1, 2] // middle=orbit, right=pan by default

    this.camera.attachControl(canvas, true)
    this.setupAltDrag(canvas)
    this.setupCursor(canvas)
  }

  /** True while the user is Alt+dragging or in navigate mode dragging — suppresses tools. */
  get isAltDragging(): boolean {
    return this._isAltDragging
  }

  /** Switch to navigate mode: left-click drag orbits freely, no tools fire. */
  setNavigateMode(enabled: boolean): void {
    this._navigateMode = enabled
    if (enabled) {
      this.pointers.buttons = [0, 1, 2] // left also orbits
      this.canvas.style.cursor = 'grab'
    } else {
      this.pointers.buttons = [1, 2]
      this.canvas.style.cursor = 'crosshair'
    }
  }

  get navigateMode(): boolean {
    return this._navigateMode
  }

  private setupAltDrag(canvas: HTMLCanvasElement): void {
    canvas.addEventListener('pointerdown', (e) => {
      if (e.button === 0 && e.altKey && !this._navigateMode) {
        this._isAltDragging = true
        this.lastX = e.clientX
        this.lastY = e.clientY
        canvas.setPointerCapture(e.pointerId)
        canvas.style.cursor = 'grabbing'
        e.stopPropagation()
      }
    }, true)

    canvas.addEventListener('pointermove', (e) => {
      if (!this._isAltDragging) return
      const dx = e.clientX - this.lastX
      const dy = e.clientY - this.lastY
      this.camera.alpha -= dx * this.orbitSpeed
      this.camera.beta = Math.max(0.05, Math.min(Math.PI - 0.05,
        this.camera.beta - dy * this.orbitSpeed
      ))
      this.lastX = e.clientX
      this.lastY = e.clientY
      e.stopPropagation()
    }, true)

    canvas.addEventListener('pointerup', (e) => {
      if (this._isAltDragging) {
        this._isAltDragging = false
        canvas.releasePointerCapture(e.pointerId)
        canvas.style.cursor = e.altKey ? 'grab' : 'crosshair'
        e.stopPropagation()
      }
    }, true)
  }

  private setupCursor(canvas: HTMLCanvasElement): void {
    canvas.style.cursor = 'crosshair'

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Alt' && !this._isAltDragging && !this._navigateMode) {
        canvas.style.cursor = 'grab'
      }
    })

    window.addEventListener('keyup', (e) => {
      if (e.key === 'Alt' && !this._navigateMode) {
        canvas.style.cursor = this._isAltDragging ? 'grabbing' : 'crosshair'
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
