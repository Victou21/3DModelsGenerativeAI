import { useStore } from '../store/useStore'

const TOOL_LABELS: Record<string, string> = {
  navigate: 'Navigate',
  add: 'Add',
  remove: 'Erase',
  paint: 'Paint'
}

const TOOL_HINTS: Record<string, string> = {
  navigate: 'drag to rotate · right drag to pan',
  add:      '⌥ drag · middle drag to rotate',
  remove:   '⌥ drag · middle drag to rotate',
  paint:    '⌥ drag · middle drag to rotate',
  select:   'middle drag to rotate · right drag to pan',
  move:     'drag arrows · middle drag to rotate',
  rotate:   'drag rings · middle drag to rotate',
  scale:    'drag handles · middle drag to rotate',
}

/**
 * StatusBar — minimal bottom bar showing contextual info.
 */
export function StatusBar(): JSX.Element {
  const activeTool     = useStore((s) => s.activeTool)
  const activeMeshTool = useStore((s) => s.activeMeshTool)
  const appMode        = useStore((s) => s.appMode)
  const voxelCount     = useStore((s) => s.voxelCount)
  const currentTool    = appMode === 'mesh' ? activeMeshTool : activeTool

  return (
    <div className="status-bar">
      <span>Grid 32 × 32 × 32</span>
      <span>{TOOL_LABELS[currentTool] ?? currentTool}</span>
      <span className="status-hint">{TOOL_HINTS[currentTool]}</span>
      <span>{voxelCount} {voxelCount === 1 ? 'voxel' : 'voxels'}</span>
    </div>
  )
}
