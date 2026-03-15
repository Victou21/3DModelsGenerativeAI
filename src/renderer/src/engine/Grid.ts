import {
  Scene,
  Mesh,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Color4,
  Vector3
} from '@babylonjs/core'

/**
 * Grid — renders a flat reference grid on the Y=0 plane.
 * Built from line meshes so it works without any special material plugins.
 */
export class Grid {
  private mesh: Mesh
  private lines: Mesh

  constructor(scene: Scene, size: number = 32) {
    // Ground plane (invisible, used only for raycasting when scene is empty)
    this.mesh = MeshBuilder.CreateGround('gridGround', { width: size, height: size }, scene)
    this.mesh.position.set(size / 2, 0, size / 2)
    const groundMat = new StandardMaterial('groundMat', scene)
    groundMat.diffuseColor = new Color3(0.1, 0.1, 0.1)
    groundMat.specularColor = Color3.Black()
    this.mesh.material = groundMat

    // Grid lines
    const lineColor = new Color4(0.25, 0.25, 0.25, 1)
    const paths: Vector3[][] = []

    for (let i = 0; i <= size; i++) {
      paths.push([new Vector3(i, 0.01, 0), new Vector3(i, 0.01, size)])
      paths.push([new Vector3(0, 0.01, i), new Vector3(size, 0.01, i)])
    }

    this.lines = MeshBuilder.CreateLineSystem('gridLines', { lines: paths }, scene)
    this.lines.color = new Color3(0.22, 0.22, 0.22)
    this.lines.isPickable = false
  }

  setVisible(visible: boolean): void {
    this.mesh.isVisible = visible
    this.lines.isVisible = visible
  }

  getGroundMesh(): Mesh {
    return this.mesh
  }

  dispose(): void {
    this.mesh.dispose()
    this.lines.dispose()
  }
}
