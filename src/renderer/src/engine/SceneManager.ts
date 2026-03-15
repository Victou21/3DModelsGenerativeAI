import {
  Engine,
  Scene,
  HemisphericLight,
  DirectionalLight,
  Vector3,
  Color4,
  Color3,
  PointerEventTypes
} from '@babylonjs/core'
import { Camera } from './Camera'
import { VoxelGrid } from './VoxelGrid'
import { VoxelRenderer } from './VoxelRenderer'
import { GhostVoxel } from './GhostVoxel'
import { Grid } from './Grid'
import { Exporter } from './Exporter'
import { UndoRedoStack } from './UndoRedoStack'
import { KeyboardHandler } from './KeyboardHandler'
import { Tool } from './tools/Tool'
import { AddTool } from './tools/AddTool'
import { RemoveTool } from './tools/RemoveTool'
import { PaintTool } from './tools/PaintTool'

export type ToolName = 'add' | 'remove' | 'paint'

/**
 * SceneManager — top-level orchestrator for the Babylon.js scene.
 * Coordinates: engine, scene, camera, grid, renderer, ghost, undo stack,
 * keyboard handler, and the active tool.
 */
export class SceneManager {
  private engine: Engine
  private scene: Scene
  private camera: Camera
  private voxelGrid: VoxelGrid
  private renderer: VoxelRenderer
  private ghost: GhostVoxel
  private grid: Grid
  private exporter: Exporter
  private undoStack: UndoRedoStack
  private keyboard: KeyboardHandler

  private tools: Map<ToolName, Tool> = new Map([
    ['add', new AddTool()],
    ['remove', new RemoveTool()],
    ['paint', new PaintTool()]
  ])

  private activeTool: Tool
  private activeColor: string = '#5B8DD9'
  private activeToolName: ToolName = 'add'

  // React callbacks
  onVoxelCountChange?: (count: number) => void
  onToolChange?: (tool: ToolName) => void
  onHistoryChange?: (canUndo: boolean, canRedo: boolean) => void

  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true, { preserveDrawingBuffer: true })
    this.scene = new Scene(this.engine)
    this.scene.clearColor = new Color4(0.055, 0.055, 0.055, 1)

    this.camera = new Camera(this.scene, canvas)
    this.voxelGrid = new VoxelGrid(32)
    this.renderer = new VoxelRenderer(this.scene)
    this.ghost = new GhostVoxel(this.scene)
    this.grid = new Grid(this.scene, 32)
    this.exporter = new Exporter(this.scene)
    this.undoStack = new UndoRedoStack()

    this.activeTool = this.tools.get('add')!

    this.undoStack.onHistoryChange = (canUndo, canRedo) => {
      this.onHistoryChange?.(canUndo, canRedo)
    }

    this.keyboard = new KeyboardHandler({
      setTool: (t) => this.setTool(t),
      undo: () => this.undo(),
      redo: () => this.redo(),
      exportGLB: () => this.exportGLB()
    })

    this.setupLights()
    this.setupPointerEvents()

    this.engine.runRenderLoop(() => this.scene.render())
    window.addEventListener('resize', () => this.engine.resize())
  }

  // ─── Private setup ─────────────────────────────────────────────

  private setupLights(): void {
    const ambient = new HemisphericLight('ambient', new Vector3(0, 1, 0), this.scene)
    ambient.intensity = 0.6
    ambient.groundColor = new Color3(0.3, 0.3, 0.3)

    const sun = new DirectionalLight('sun', new Vector3(-1, -2, -1), this.scene)
    sun.intensity = 0.8
    sun.position = new Vector3(20, 40, 20)
  }

  private buildToolContext() {
    return {
      grid: this.voxelGrid,
      renderer: this.renderer,
      scene: this.scene,
      activeColor: this.activeColor
    }
  }

  private setupPointerEvents(): void {
    this.scene.onPointerObservable.add((pointerInfo) => {
      // Suppress all tool events while Alt+dragging to orbit
      if (this.camera.isAltDragging) {
        this.ghost.hide()
        return
      }

      const pick = this.scene.pick(this.scene.pointerX, this.scene.pointerY)
      if (!pick) return

      const ctx = this.buildToolContext()

      switch (pointerInfo.type) {
        case PointerEventTypes.POINTERMOVE: {
          // Ghost voxel preview (independent of drag — always update)
          let ghostShown = false
          if (this.activeToolName === 'add' && pick.hit && pick.pickedPoint && pick.getNormal) {
            const normal = pick.getNormal(true)
            if (normal) {
              const wp = pick.pickedPoint.add(normal.scale(0.5))
              const x = Math.floor(wp.x)
              const y = Math.floor(wp.y)
              const z = Math.floor(wp.z)
              if (!this.voxelGrid.has(x, y, z) && this.voxelGrid.inBounds(x, y, z)) {
                this.ghost.show(x, y, z, this.activeColor)
                ghostShown = true
              }
            }
          }
          if (!ghostShown) this.ghost.hide()

          // Drag placement — fires every cell the cursor enters
          if (pointerInfo.event.buttons === 1) {
            const cmd = this.activeTool.onPointerMove(pick, ctx)
            if (cmd) {
              this.undoStack.execute(cmd)
              this.onVoxelCountChange?.(this.voxelGrid.count())
            }
          }
          break
        }

        case PointerEventTypes.POINTERDOWN: {
          if (pointerInfo.event.button !== 0) break
          const cmd = this.activeTool.onPointerDown(pick, ctx)
          if (cmd) {
            this.undoStack.execute(cmd)
            this.onVoxelCountChange?.(this.voxelGrid.count())
          }
          break
        }

        case PointerEventTypes.POINTERUP: {
          this.activeTool.onPointerUp(pick, ctx)
          break
        }
      }
    })
  }

  // ─── Public API ────────────────────────────────────────────────

  setTool(name: ToolName): void {
    const tool = this.tools.get(name)
    if (!tool) return
    this.activeTool = tool
    this.activeToolName = name
    if (name !== 'add') this.ghost.hide()
    this.onToolChange?.(name)
  }

  setColor(hex: string): void {
    this.activeColor = hex
  }

  setGridVisible(visible: boolean): void {
    this.grid.setVisible(visible)
  }

  undo(): void {
    this.undoStack.undo()
    this.onVoxelCountChange?.(this.voxelGrid.count())
  }

  redo(): void {
    this.undoStack.redo()
    this.onVoxelCountChange?.(this.voxelGrid.count())
  }

  async exportGLB(): Promise<void> {
    await this.exporter.exportGLB()
  }

  getVoxelCount(): number {
    return this.voxelGrid.count()
  }

  getGridSize(): number {
    return this.voxelGrid.size
  }

  canUndo(): boolean { return this.undoStack.canUndo() }
  canRedo(): boolean { return this.undoStack.canRedo() }

  dispose(): void {
    this.keyboard.dispose()
    this.ghost.dispose()
    this.grid.dispose()
    this.renderer.dispose()
    this.camera.dispose()
    window.removeEventListener('resize', () => this.engine.resize())
    this.engine.dispose()
  }
}
