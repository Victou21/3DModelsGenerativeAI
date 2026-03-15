import { create } from 'zustand'
import { ToolName } from '../engine/SceneManager'

interface ForgeState {
  activeTool: ToolName
  activeColor: string
  voxelCount: number
  showColorPicker: boolean
  showGrid: boolean
  canUndo: boolean
  canRedo: boolean

  setActiveTool: (tool: ToolName) => void
  setActiveColor: (color: string) => void
  setVoxelCount: (count: number) => void
  setShowColorPicker: (show: boolean) => void
  setShowGrid: (show: boolean) => void
  setHistory: (canUndo: boolean, canRedo: boolean) => void
}

export const useStore = create<ForgeState>((set) => ({
  activeTool: 'add',
  activeColor: '#5B8DD9',
  voxelCount: 0,
  showColorPicker: false,
  showGrid: true,
  canUndo: false,
  canRedo: false,

  setActiveTool: (tool) => set({ activeTool: tool }),
  setActiveColor: (color) => set({ activeColor: color }),
  setVoxelCount: (count) => set({ voxelCount: count }),
  setShowColorPicker: (show) => set({ showColorPicker: show }),
  setShowGrid: (show) => set({ showGrid: show }),
  setHistory: (canUndo, canRedo) => set({ canUndo, canRedo })
}))
