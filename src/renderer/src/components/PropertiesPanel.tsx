import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/useStore'
import { MeshObject } from '../engine/mesh/MeshObject'

interface Vec3 { x: number; y: number; z: number }

interface LiveTransform {
  position: Vec3
  rotation: Vec3
  scale: Vec3
}

function Vec3Row({ label, v, axisColors }: {
  label: string
  v: Vec3
  axisColors?: [string, string, string]
}): JSX.Element {
  const [xc, yc, zc] = axisColors ?? ['#e05', '#5b5', '#48f']
  return (
    <div className="prop-row">
      <span className="prop-label">{label}</span>
      <div className="prop-vec3">
        <span className="prop-axis" style={{ color: xc }}>X</span>
        <span className="prop-val">{v.x.toFixed(2)}</span>
        <span className="prop-axis" style={{ color: yc }}>Y</span>
        <span className="prop-val">{v.y.toFixed(2)}</span>
        <span className="prop-axis" style={{ color: zc }}>Z</span>
        <span className="prop-val">{v.z.toFixed(2)}</span>
      </div>
    </div>
  )
}

interface Props {
  onColorChange: (hex: string) => void
  onRename: (id: string, name: string) => void
}

const toDeg = (r: number) => (r * 180) / Math.PI

/**
 * PropertiesPanel — reads live position/rotation/scale from the Babylon mesh
 * via requestAnimationFrame so values update while gizmos are being dragged.
 */
export function PropertiesPanel({ onColorChange, onRename }: Props): JSX.Element {
  const selectedObject = useStore((s) => s.selectedMeshObject)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const rafRef = useRef<number>(0)
  const [transform, setTransform] = useState<LiveTransform | null>(null)

  // Sync name input when selection changes
  useEffect(() => {
    if (nameInputRef.current && selectedObject) {
      nameInputRef.current.value = selectedObject.name
    }
  }, [selectedObject?.id])

  // RAF loop — reads live mesh transform every frame while an object is selected
  useEffect(() => {
    if (!selectedObject) {
      setTransform(null)
      return
    }

    const loop = () => {
      const m = selectedObject.mesh
      setTransform({
        position: { x: m.position.x, y: m.position.y, z: m.position.z },
        rotation: { x: toDeg(m.rotation.x), y: toDeg(m.rotation.y), z: toDeg(m.rotation.z) },
        scale:    { x: m.scaling.x,    y: m.scaling.y,    z: m.scaling.z }
      })
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [selectedObject?.id])

  if (!selectedObject || !transform) {
    return (
      <div className="panel">
        <div className="panel-header">Properties</div>
        <div className="hierarchy-empty">Select an object</div>
      </div>
    )
  }

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
        <Vec3Row label="Position" v={transform.position} />
        <Vec3Row label="Rotation" v={transform.rotation} />
        <Vec3Row label="Scale"    v={transform.scale} />
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
