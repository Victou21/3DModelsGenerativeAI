import { useStore } from '../store/useStore'
import { MeshObjectData } from '../engine/mesh/MeshObject'

interface Props {
  onSelect: (id: string) => void
  onDelete: () => void
}

const TYPE_EMOJI: Record<string, string> = {
  box: '⬜', sphere: '⚪', cylinder: '🔵',
  plane: '▭', cone: '🔺', torus: '⭕'
}

export function SceneHierarchy({ onSelect, onDelete }: Props): JSX.Element {
  const objects = useStore((s) => s.meshObjects)
  const selectedId = useStore((s) => s.selectedMeshId)

  return (
    <div className="panel">
      <div className="panel-header">Scene</div>

      <div className="hierarchy-list">
        {objects.length === 0 && (
          <div className="hierarchy-empty">No objects — add a primitive</div>
        )}
        {objects.map((obj: MeshObjectData) => (
          <div
            key={obj.id}
            className={`hierarchy-item ${selectedId === obj.id ? 'selected' : ''}`}
            onClick={() => onSelect(obj.id)}
          >
            <span className="hierarchy-icon">{TYPE_EMOJI[obj.type] ?? '◻'}</span>
            <span className="hierarchy-name">{obj.name}</span>
          </div>
        ))}
      </div>

      {selectedId && (
        <button className="delete-btn" onClick={onDelete}>
          Delete
        </button>
      )}
    </div>
  )
}
