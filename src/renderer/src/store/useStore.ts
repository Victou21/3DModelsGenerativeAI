import { create } from 'zustand'
import { ToolName, MeshToolName, AppMode } from '../engine/SceneManager'
import { MeshObjectData } from '../engine/mesh/MeshObject'

interface ForgeState {
  // App
  appMode: AppMode

  // Voxel
  activeTool: ToolName
  activeColor: string
  voxelCount: number
  showGrid: boolean
  canUndo: boolean
  canRedo: boolean
  showColorPicker: boolean

  // Mesh
  activeMeshTool: MeshToolName
  meshObjects: MeshObjectData[]
  selectedMeshId: string | null

  // Setters
  setAppMode: (mode: AppMode) => void
  setActiveTool: (tool: ToolName) => void
  setActiveColor: (color: string) => void
  setVoxelCount: (count: number) => void
  setShowGrid: (show: boolean) => void
  setHistory: (canUndo: boolean, canRedo: boolean) => void
  setShowColorPicker: (show: boolean) => void
  setActiveMeshTool: (tool: MeshToolName) => void
  setMeshObjects: (objects: MeshObjectData[]) => void
  setSelectedMeshId: (id: string | null) => void
}

export const useStore = create<ForgeState>((set) => ({
  appMode: 'voxel',
  activeTool: 'add',
  activeColor: '#5B8DD9',
  voxelCount: 0,
  showGrid: true,
  canUndo: false,
  canRedo: false,
  showColorPicker: false,
  activeMeshTool: 'select',
  meshObjects: [],
  selectedMeshId: null,

  setAppMode:        (appMode)       => set({ appMode }),
  setActiveTool:     (activeTool)    => set({ activeTool }),
  setActiveColor:    (activeColor)   => set({ activeColor }),
  setVoxelCount:     (voxelCount)    => set({ voxelCount }),
  setShowGrid:       (showGrid)      => set({ showGrid }),
  setHistory:        (canUndo, canRedo) => set({ canUndo, canRedo }),
  setShowColorPicker:(showColorPicker) => set({ showColorPicker }),
  setActiveMeshTool: (activeMeshTool) => set({ activeMeshTool }),
  setMeshObjects:    (meshObjects)   => set({ meshObjects }),
  setSelectedMeshId: (selectedMeshId) => set({ selectedMeshId })
}))
