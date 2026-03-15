import { Scene, GizmoManager } from '@babylonjs/core'
import { MeshObject } from './MeshObject'

export type GizmoMode = 'select' | 'move' | 'rotate' | 'scale'

/**
 * SelectionManager — handles object picking, selection, and transform gizmos.
 *
 * Key rules to keep gizmos stable:
 *  - Never re-attach the gizmo if the same object is already selected.
 *  - If a pick hits something with no meshObjectId (could be a gizmo handle
 *    or the grid), do NOT clear selection — let Babylon handle the drag.
 *  - Only clear selection when clicking confirmed empty space.
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
  }

  setGizmoMode(mode: GizmoMode): void {
    this.gizmoMode = mode
    this.gizmoManager.positionGizmoEnabled  = mode === 'move'
    this.gizmoManager.rotationGizmoEnabled  = mode === 'rotate'
    this.gizmoManager.scaleGizmoEnabled     = mode === 'scale'
    this.gizmoManager.boundingBoxGizmoEnabled = false

    if (this.selected) {
      this.gizmoManager.attachToMesh(mode !== 'select' ? this.selected.mesh : null)
    }
  }

  trySelect(meshObjects: Map<string, MeshObject>): void {
    const pick = this.scene.pick(this.scene.pointerX, this.scene.pointerY)

    // Nothing hit at all → clear selection
    if (!pick.hit || !pick.pickedMesh) {
      this.clearSelection()
      return
    }

    const id = pick.pickedMesh.metadata?.meshObjectId

    // Hit something without a meshObjectId (gizmo handle, grid, etc.)
    // → do NOT clear, let Babylon handle it
    if (!id) return

    const obj = meshObjects.get(id)
    if (!obj) return

    // Already selected → do nothing (prevents gizmo re-attach mid-drag)
    if (this.selected?.id === obj.id) return

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
