import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { SceneManager, AppMode, MeshToolName } from '../engine/SceneManager'
import { MeshObject, PrimitiveType } from '../engine/mesh/MeshObject'
import { useStore } from '../store/useStore'

export interface ViewportHandle {
  undo: () => void
  redo: () => void
  exportGLB: () => void
  setMode: (mode: AppMode) => void
  addPrimitive: (type: PrimitiveType) => void
  setMeshTool: (tool: MeshToolName) => void
  deleteSelectedMesh: () => void
  renameMeshObject: (id: string, name: string) => void
  setSelectedMeshColor: (hex: string) => void
  selectMeshById: (id: string) => void
}

export const Viewport = forwardRef<ViewportHandle>(function Viewport(_props, ref) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const managerRef = useRef<SceneManager | null>(null)

  const activeTool    = useStore((s) => s.activeTool)
  const activeColor   = useStore((s) => s.activeColor)
  const showGrid      = useStore((s) => s.showGrid)
  const setVoxelCount = useStore((s) => s.setVoxelCount)
  const setActiveTool = useStore((s) => s.setActiveTool)
  const setHistory    = useStore((s) => s.setHistory)
  const setAppMode    = useStore((s) => s.setAppMode)
  const setMeshObjects = useStore((s) => s.setMeshObjects)
  const setSelectedMeshId = useStore((s) => s.setSelectedMeshId)

  useImperativeHandle(ref, () => ({
    undo:                () => managerRef.current?.undo(),
    redo:                () => managerRef.current?.redo(),
    exportGLB:           () => managerRef.current?.exportGLB(),
    setMode:             (m) => managerRef.current?.setMode(m),
    addPrimitive:        (t) => managerRef.current?.addPrimitive(t),
    setMeshTool:         (t) => managerRef.current?.setMeshTool(t),
    deleteSelectedMesh:  ()  => managerRef.current?.deleteSelectedMesh(),
    renameMeshObject:    (id, name) => managerRef.current?.renameMeshObject(id, name),
    setSelectedMeshColor:(hex) => managerRef.current?.setSelectedMeshColor(hex),
    selectMeshById:      (id) => {
      const obj = managerRef.current?.['meshManager']?.getObject(id)
      if (obj) managerRef.current?.['meshManager']?.selection.select(obj)
    }
  }))

  useEffect(() => {
    if (!canvasRef.current) return
    const manager = new SceneManager(canvasRef.current)
    manager.onVoxelCountChange    = setVoxelCount
    manager.onToolChange          = setActiveTool
    manager.onHistoryChange       = setHistory
    manager.onModeChange          = setAppMode
    manager.onMeshObjectsChange   = setMeshObjects
    manager.onMeshSelectionChange = (obj: MeshObject | null) => setSelectedMeshId(obj?.id ?? null)
    managerRef.current = manager
    return () => { manager.dispose(); managerRef.current = null }
  }, [])

  useEffect(() => { managerRef.current?.setTool(activeTool) },      [activeTool])
  useEffect(() => { managerRef.current?.setColor(activeColor) },     [activeColor])
  useEffect(() => { managerRef.current?.setGridVisible(showGrid) },  [showGrid])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block', outline: 'none' }}
    />
  )
})
