import { useStore } from '../store/useStore'

const TOOL_LABELS: Record<string, string> = {
  add: 'Add',
  remove: 'Erase',
  paint: 'Paint'
}

/**
 * StatusBar — minimal bottom bar showing contextual info.
 */
export function StatusBar(): JSX.Element {
  const activeTool = useStore((s) => s.activeTool)
  const voxelCount = useStore((s) => s.voxelCount)

  return (
    <div className="status-bar">
      <span>Grid 32 × 32 × 32</span>
      <span>{TOOL_LABELS[activeTool] ?? activeTool}</span>
      <span>{voxelCount} {voxelCount === 1 ? 'voxel' : 'voxels'}</span>
    </div>
  )
}
