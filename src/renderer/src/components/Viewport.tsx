import { useEffect, useRef } from 'react'
import { SceneManager } from '../engine/SceneManager'
import { useStore } from '../store/useStore'

/**
 * Viewport — mounts the Babylon.js canvas and owns the SceneManager lifecycle.
 * Syncs store state into the engine via callbacks and effect hooks.
 */
export function Viewport(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const managerRef = useRef<SceneManager | null>(null)

  const activeTool = useStore((s) => s.activeTool)
  const activeColor = useStore((s) => s.activeColor)
  const showGrid = useStore((s) => s.showGrid)
  const setVoxelCount = useStore((s) => s.setVoxelCount)
  const setActiveTool = useStore((s) => s.setActiveTool)
  const setHistory = useStore((s) => s.setHistory)

  useEffect(() => {
    if (!canvasRef.current) return

    const manager = new SceneManager(canvasRef.current)

    manager.onVoxelCountChange = setVoxelCount
    manager.onToolChange = setActiveTool
    manager.onHistoryChange = setHistory

    managerRef.current = manager

    return () => {
      manager.dispose()
      managerRef.current = null
    }
  }, [])

  useEffect(() => { managerRef.current?.setTool(activeTool) }, [activeTool])
  useEffect(() => { managerRef.current?.setColor(activeColor) }, [activeColor])
  useEffect(() => { managerRef.current?.setGridVisible(showGrid) }, [showGrid])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block', outline: 'none' }}
    />
  )
}
