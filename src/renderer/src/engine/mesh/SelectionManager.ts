import {
  Scene,
  GizmoManager,
  Mesh,
  Color3
} from '@babylonjs/core'
import { MeshObject } from './MeshObject'

export type GizmoMode = 'select' | 'move' | 'rotate' | 'scale'

/**
 * SelectionManager — handles object picking, selection highlight,
 * and Babylon.js transform gizmos (move / rotate / scale).
 */
export class SelectionManager {
  private scene: Scene
  private gizmoManager: GizmoManager
  private selected: MeshObject | null = null
  private gizmoMode: GizmoMode = 'select'

  onSelectionChange?: (obj: MeshObject | null) => void

  constructor(scene: Scene) {
    this.scene = scene
    this.gizmoManager = new GizmoManager(scene)
    this.gizmoManager.usePointerToAttachGizmos = false

    // Style the gizmos to match the dark theme
    this.gizmoManager.gizmos.positionGizmo?.xGizmo.setCustomMesh
  }

  setGizmoMode(mode: GizmoMode): void {
    this.gizmoMode = mode
    this.gizmoManager.positionGizmoEnabled  = mode === 'move'
    this.gizmoManager.rotationGizmoEnabled  = mode === 'rotate'
    this.gizmoManager.scaleGizmoEnabled     = mode === 'scale'
    this.gizmoManager.boundingBoxGizmoEnabled = false

    // Re-attach to current selection
    if (this.selected) {
      this.gizmoManager.attachToMesh(mode !== 'select' ? this.selected.mesh : null)
    }
  }

  /** Call this when user clicks in mesh mode to try selecting an object. */
  trySelect(meshObjects: Map<string, MeshObject>): void {
    const pick = this.scene.pick(this.scene.pointerX, this.scene.pointerY)

    if (!pick.hit || !pick.pickedMesh) {
      this.clearSelection()
      return
    }

    const id = pick.pickedMesh.metadata?.meshObjectId
    const obj = id ? meshObjects.get(id) : undefined

    if (!obj) {
      this.clearSelection()
      return
    }

    this.select(obj)
  }

  select(obj: MeshObject): void {
    this.selected = obj

    if (this.gizmoMode !== 'select') {
      this.gizmoManager.attachToMesh(obj.mesh)
    }

    this.onSelectionChange?.(obj)
  }

  clearSelection(): void {
    this.selected = null
    this.gizmoManager.attachToMesh(null)
    this.onSelectionChange?.(null)
  }

  getSelected(): MeshObject | null {
    return this.selected
  }

  dispose(): void {
    this.gizmoManager.dispose()
  }
}
