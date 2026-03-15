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
 *   Alt + Left drag  → orbit  (shows grab cursor, blocks tool events)
 *   Middle drag      → orbit
 *   Right drag       → pan
 *   Scroll           → zoom
 */
export class Camera {
  private camera: ArcRotateCamera
  private _isAltDragging = false
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

    // Middle=orbit, Right=pan — left is reserved for tools
    const pointers = this.camera.inputs.attached['pointers'] as ArcRotateCameraPointersInput
    pointers.buttons = [1, 2]

    this.camera.attachControl(canvas, true)
    this.setupAltDrag(canvas)
    this.setupCursor(canvas)
  }

  /** True while the user is Alt+left dragging to orbit. Used by SceneManager to suppress tools. */
  get isAltDragging(): boolean {
    return this._isAltDragging
  }

  private setupAltDrag(canvas: HTMLCanvasElement): void {
    canvas.addEventListener('pointerdown', (e) => {
      if (e.button === 0 && e.altKey) {
        this._isAltDragging = true
        this.lastX = e.clientX
        this.lastY = e.clientY
        canvas.setPointerCapture(e.pointerId)
        canvas.style.cursor = 'grabbing'
        e.stopPropagation()
      }
    }, true) // useCapture=true so it fires before Babylon's listener

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

  /** Show grab cursor when Alt is held, crosshair otherwise. */
  private setupCursor(canvas: HTMLCanvasElement): void {
    canvas.style.cursor = 'crosshair'

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Alt' && !this._isAltDragging) {
        canvas.style.cursor = 'grab'
      }
    })

    window.addEventListener('keyup', (e) => {
      if (e.key === 'Alt') {
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
