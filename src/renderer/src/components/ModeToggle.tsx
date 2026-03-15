import { useStore } from '../store/useStore'
import { AppMode } from '../engine/SceneManager'

interface Props {
  onChange: (mode: AppMode) => void
}

export function ModeToggle({ onChange }: Props): JSX.Element {
  const appMode = useStore((s) => s.appMode)

  const select = (mode: AppMode) => {
    onChange(mode)
  }

  return (
    <div className="mode-toggle">
      <button
        className={`mode-btn ${appMode === 'voxel' ? 'active' : ''}`}
        onClick={() => select('voxel')}
      >
        Voxel
      </button>
      <button
        className={`mode-btn ${appMode === 'mesh' ? 'active' : ''}`}
        onClick={() => select('mesh')}
      >
        Mesh
      </button>
    </div>
  )
}
