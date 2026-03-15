import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'
import { MeshObject } from '../engine/mesh/MeshObject'

interface Props {
  selectedObject: MeshObject | null
  onColorChange: (hex: string) => void
  onRename: (id: string, name: string) => void
}

function Vec3Row({ label, x, y, z }: { label: string; x: number; y: number; z: number }): JSX.Element {
  return (
    <div className="prop-row">
      <span className="prop-label">{label}</span>
      <div className="prop-vec3">
        <span className="prop-axis x">X</span><span className="prop-val">{x.toFixed(2)}</span>
        <span className="prop-axis y">Y</span><span className="prop-val">{y.toFixed(2)}</span>
        <span className="prop-axis z">Z</span><span className="prop-val">{z.toFixed(2)}</span>
      </div>
    </div>
  )
}

export function PropertiesPanel({ selectedObject, onColorChange, onRename }: Props): JSX.Element {
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (nameInputRef.current && selectedObject) {
      nameInputRef.current.value = selectedObject.name
    }
  }, [selectedObject?.id])

  if (!selectedObject) {
    return (
      <div className="panel">
        <div className="panel-header">Properties</div>
        <div className="hierarchy-empty">Select an object</div>
      </div>
    )
  }

  const pos = selectedObject.mesh.position
  const rot = selectedObject.mesh.rotation
  const scl = selectedObject.mesh.scaling

  const toDeg = (r: number) => ((r * 180) / Math.PI)

  return (
    <div className="panel">
      <div className="panel-header">Properties</div>

      <div className="prop-section">
        <input
          ref={nameInputRef}
          className="prop-name-input"
          defaultValue={selectedObject.name}
          onBlur={(e) => onRename(selectedObject.id, e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
        />
      </div>

      <div className="prop-section">
        <Vec3Row label="Position" x={pos.x} y={pos.y} z={pos.z} />
        <Vec3Row label="Rotation" x={toDeg(rot.x)} y={toDeg(rot.y)} z={toDeg(rot.z)} />
        <Vec3Row label="Scale"    x={scl.x} y={scl.y} z={scl.z} />
      </div>

      <div className="prop-section">
        <div className="prop-row">
          <span className="prop-label">Color</span>
          <input
            type="color"
            className="prop-color-input"
            defaultValue={selectedObject.getColor()}
            onChange={(e) => onColorChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
