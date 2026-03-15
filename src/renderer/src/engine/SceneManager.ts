import {
  Engine,
  Scene,
  HemisphericLight,
  DirectionalLight,
  Vector3,
  Color4,
  Color3,
  MeshBuilder,
  StandardMaterial,
  PointerEventTypes,
  Mesh
} from '@babylonjs/core'
import { Camera } from './Camera'
import { VoxelGrid } from './VoxelGrid'
import { VoxelRenderer } from './VoxelRenderer'
import { Tool } from './tools/Tool'
import { AddTool } from './tools/AddTool'
import { RemoveTool } from './tools/RemoveTool'
import { PaintTool } from './tools/PaintTool'

export type ToolName = 'add' | 'remove' | 'paint'

/**
 * SceneManager — top-level orchestrator for the Babylon.js scene.
 * Owns the engine, scene, camera, grid and renderer.
 * Routes pointer events to the active tool.
 */
export class SceneManager {
  private engine: Engine
  private scene: Scene
  private camera: Camera
  private grid: VoxelGrid
  private renderer: VoxelRenderer
  private groundMesh: Mesh | null = null

  private tools: Map<ToolName, Tool> = new Map([
    ['add', new AddTool()],
    ['remove', new RemoveTool()],
    ['paint', new PaintTool()]
  ])

  private activeTool: Tool
  private activeColor: string = '#5B8DD9'

  // Callbacks so React can stay in sync
  onVoxelCountChange?: (count: number) => void

  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true, { preserveDrawingBuffer: true })
    this.scene = new Scene(this.engine)
    this.scene.clearColor = new Color4(0.055, 0.055, 0.055, 1)

    this.camera = new Camera(this.scene, canvas)
    this.grid = new VoxelGrid(32)
    this.renderer = new VoxelRenderer(this.scene)

    this.activeTool = this.tools.get('add')!

    this.setupLights()
    this.setupGround()
    this.setupPointerEvents()

    this.engine.runRenderLoop(() => this.scene.render())
    window.addEventListener('resize', () => this.engine.resize())
  }

  private setupLights(): void {
    const ambient = new HemisphericLight('ambient', new Vector3(0, 1, 0), this.scene)
    ambient.intensity = 0.6
    ambient.diffuse = new Color3(1, 1, 1)
    ambient.groundColor = new Color3(0.3, 0.3, 0.3)

    const sun = new DirectionalLight('sun', new Vector3(-1, -2, -1), this.scene)
    sun.intensity = 0.8
    sun.position = new Vector3(20, 40, 20)
  }

  private setupGround(): void {
    this.groundMesh = MeshBuilder.CreateGround(
      'ground',
      { width: 32, height: 32 },
      this.scene
    )
    this.groundMesh.position.set(16, 0, 16)

    // Use a simple grid material for the ground plane
    const mat = new StandardMaterial('groundMat', this.scene)
    mat.diffuseColor = new Color3(0.12, 0.12, 0.12)
    mat.specularColor = Color3.Black()
    this.groundMesh.material = mat
  }

  private setupPointerEvents(): void {
    this.scene.onPointerObservable.add((pointerInfo) => {
      const pick = this.scene.pick(
        this.scene.pointerX,
        this.scene.pointerY
      )

      if (!pick) return

      const ctx = {
        grid: this.grid,
        renderer: this.renderer,
        scene: this.scene,
        activeColor: this.activeColor
      }

      switch (pointerInfo.type) {
        case PointerEventTypes.POINTERDOWN:
          if (pointerInfo.event.button === 0) {
            this.activeTool.onPointerDown(pick, ctx)
            this.onVoxelCountChange?.(this.grid.count())
          }
          break
        case PointerEventTypes.POINTERMOVE:
          this.activeTool.onPointerMove(pick, ctx)
          this.onVoxelCountChange?.(this.grid.count())
          break
        case PointerEventTypes.POINTERUP:
          this.activeTool.onPointerUp(pick, ctx)
          break
      }
    })
  }

  setTool(name: ToolName): void {
    const tool = this.tools.get(name)
    if (tool) this.activeTool = tool
  }

  setColor(hex: string): void {
    this.activeColor = hex
  }

  setGroundVisible(visible: boolean): void {
    if (this.groundMesh) this.groundMesh.isVisible = visible
  }

  getVoxelCount(): number {
    return this.grid.count()
  }

  getGridSize(): number {
    return this.grid.size
  }

  dispose(): void {
    this.renderer.dispose()
    this.camera.dispose()
    this.engine.dispose()
  }
}
