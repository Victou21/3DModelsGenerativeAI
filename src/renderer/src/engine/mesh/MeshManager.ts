import { Scene } from '@babylonjs/core'
import { MeshObject, MeshObjectData, PrimitiveType } from './MeshObject'
import { PrimitiveFactory } from './PrimitiveFactory'
import { SelectionManager, GizmoMode } from './SelectionManager'

/**
 * MeshManager — owns all MeshObjects in the scene.
 * Delegates creation to PrimitiveFactory and selection to SelectionManager.
 */
export class MeshManager {
  private objects: Map<string, MeshObject> = new Map()
  private factory: PrimitiveFactory
  readonly selection: SelectionManager

  onObjectsChange?: (objects: MeshObjectData[]) => void
  onSelectionChange?: (obj: MeshObject | null) => void

  constructor(scene: Scene) {
    this.factory = new PrimitiveFactory(scene)
    this.selection = new SelectionManager(scene)

    this.selection.onSelectionChange = (obj) => {
      this.onSelectionChange?.(obj)
    }
  }

  addPrimitive(type: PrimitiveType): MeshObject {
    const obj = this.factory.create(type)
    this.objects.set(obj.id, obj)
    this.notifyChange()
    this.selection.select(obj)
    return obj
  }

  deleteSelected(): void {
    const obj = this.selection.getSelected()
    if (!obj) return
    this.selection.clearSelection()
    this.objects.delete(obj.id)
    obj.dispose()
    this.notifyChange()
  }

  renameObject(id: string, name: string): void {
    const obj = this.objects.get(id)
    if (obj) {
      obj.name = name
      this.notifyChange()
    }
  }

  handlePointerDown(): void {
    this.selection.trySelect(this.objects)
  }

  setGizmoMode(mode: GizmoMode): void {
    this.selection.setGizmoMode(mode)
  }

  getAll(): MeshObjectData[] {
    return Array.from(this.objects.values()).map(o => o.getData())
  }

  getObject(id: string): MeshObject | undefined {
    return this.objects.get(id)
  }

  private notifyChange(): void {
    this.onObjectsChange?.(this.getAll())
  }

  dispose(): void {
    this.selection.dispose()
    for (const obj of this.objects.values()) obj.dispose()
    this.objects.clear()
  }
}
