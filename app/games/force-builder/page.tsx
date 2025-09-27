"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Play, RotateCcw, Trophy, Lightbulb, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

interface PhysicsObject {
  id: string
  type: "block" | "ramp" | "spring" | "pulley" | "lever"
  x: number
  y: number
  width: number
  height: number
  mass: number
  velocity: { x: number; y: number }
  acceleration: { x: number; y: number }
  color: string
  isMoving: boolean
  isDragging: boolean
}

interface Mission {
  id: string
  title: string
  description: string
  objective: string
  targetObject: string
  targetPosition: { x: number; y: number }
  tolerance: number
  points: number
  hint: string
  physics: {
    gravity: number
    friction: number
    airResistance: number
  }
}

const missions: Mission[] = [
  {
    id: "rescue-cat",
    title: "Rescue the Cat",
    description: "Help the cat reach the safe platform using ramps and blocks",
    objective: "Move the cat (red block) to the green target area",
    targetObject: "cat",
    targetPosition: { x: 600, y: 300 },
    tolerance: 50,
    points: 200,
    hint: "Use a ramp to create an inclined plane. The steeper the ramp, the faster the acceleration!",
    physics: {
      gravity: 9.8,
      friction: 0.3,
      airResistance: 0.1,
    },
  },
  {
    id: "bridge-gap",
    title: "Bridge the Gap",
    description: "Create a bridge to help the ball cross the chasm",
    objective: "Get the ball across the gap using available materials",
    targetObject: "ball",
    targetPosition: { x: 700, y: 400 },
    tolerance: 40,
    points: 300,
    hint: "Combine multiple blocks to create a stable bridge. Consider the center of mass!",
    physics: {
      gravity: 9.8,
      friction: 0.4,
      airResistance: 0.05,
    },
  },
  {
    id: "launch-rocket",
    title: "Launch the Rocket",
    description: "Use springs and levers to launch the rocket to the target",
    objective: "Launch the rocket to reach the target height",
    targetObject: "rocket",
    targetPosition: { x: 400, y: 100 },
    tolerance: 60,
    points: 400,
    hint: "Springs store potential energy. The more you compress them, the more energy they release!",
    physics: {
      gravity: 9.8,
      friction: 0.2,
      airResistance: 0.15,
    },
  },
]

const toolbox = [
  { type: "block", name: "Block", color: "#8B5CF6", mass: 5 },
  { type: "ramp", name: "Ramp", color: "#10B981", mass: 3 },
  { type: "spring", name: "Spring", color: "#F59E0B", mass: 1 },
  { type: "lever", name: "Lever", color: "#EF4444", mass: 2 },
]

export default function ForceBuilderGame() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentMission, setCurrentMission] = useState(0)
  const [objects, setObjects] = useState<PhysicsObject[]>([])
  const [isSimulating, setIsSimulating] = useState(false)
  const [score, setScore] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [draggedTool, setDraggedTool] = useState<string | null>(null)
  const [physics, setPhysics] = useState(missions[0].physics)
  const [selectedObject, setSelectedObject] = useState<string | null>(null)

  const mission = missions[currentMission]

  // Initialize mission objects
  useEffect(() => {
    initializeMission()
  }, [currentMission])

  const initializeMission = () => {
    const missionObjects: PhysicsObject[] = []

    // Add mission-specific objects
    switch (mission.id) {
      case "rescue-cat":
        missionObjects.push({
          id: "cat",
          type: "block",
          x: 100,
          y: 400,
          width: 30,
          height: 30,
          mass: 2,
          velocity: { x: 0, y: 0 },
          acceleration: { x: 0, y: 0 },
          color: "#EF4444",
          isMoving: false,
          isDragging: false,
        })
        break
      case "bridge-gap":
        missionObjects.push({
          id: "ball",
          type: "block",
          x: 50,
          y: 350,
          width: 25,
          height: 25,
          mass: 1,
          velocity: { x: 0, y: 0 },
          acceleration: { x: 0, y: 0 },
          color: "#3B82F6",
          isMoving: false,
          isDragging: false,
        })
        break
      case "launch-rocket":
        missionObjects.push({
          id: "rocket",
          type: "block",
          x: 200,
          y: 450,
          width: 20,
          height: 40,
          mass: 1.5,
          velocity: { x: 0, y: 0 },
          acceleration: { x: 0, y: 0 },
          color: "#F59E0B",
          isMoving: false,
          isDragging: false,
        })
        break
    }

    setObjects(missionObjects)
    setPhysics(mission.physics)
    setIsSimulating(false)
  }

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    ctx.fillStyle = "#F8FAFC"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#E2E8F0"
    ctx.lineWidth = 1
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw target area
    ctx.fillStyle = "rgba(34, 197, 94, 0.3)"
    ctx.strokeStyle = "#22C55E"
    ctx.lineWidth = 2
    ctx.fillRect(
      mission.targetPosition.x - mission.tolerance,
      mission.targetPosition.y - mission.tolerance,
      mission.tolerance * 2,
      mission.tolerance * 2,
    )
    ctx.strokeRect(
      mission.targetPosition.x - mission.tolerance,
      mission.targetPosition.y - mission.tolerance,
      mission.tolerance * 2,
      mission.tolerance * 2,
    )

    // Draw objects
    objects.forEach((obj) => {
      ctx.fillStyle = obj.color
      ctx.strokeStyle = selectedObject === obj.id ? "#000000" : obj.color
      ctx.lineWidth = selectedObject === obj.id ? 3 : 1

      switch (obj.type) {
        case "block":
          ctx.fillRect(obj.x, obj.y, obj.width, obj.height)
          ctx.strokeRect(obj.x, obj.y, obj.width, obj.height)
          break
        case "ramp":
          ctx.beginPath()
          ctx.moveTo(obj.x, obj.y + obj.height)
          ctx.lineTo(obj.x + obj.width, obj.y + obj.height)
          ctx.lineTo(obj.x + obj.width, obj.y)
          ctx.closePath()
          ctx.fill()
          ctx.stroke()
          break
        case "spring":
          // Draw spring as zigzag
          ctx.beginPath()
          ctx.moveTo(obj.x, obj.y + obj.height)
          for (let i = 0; i < 5; i++) {
            const zigX = obj.x + (i % 2 === 0 ? 0 : obj.width)
            const zigY = obj.y + obj.height - (i * obj.height) / 5
            ctx.lineTo(zigX, zigY)
          }
          ctx.stroke()
          break
        case "lever":
          // Draw lever as line with fulcrum
          ctx.beginPath()
          ctx.moveTo(obj.x, obj.y + obj.height / 2)
          ctx.lineTo(obj.x + obj.width, obj.y + obj.height / 2)
          ctx.stroke()
          // Fulcrum
          ctx.beginPath()
          ctx.arc(obj.x + obj.width / 2, obj.y + obj.height, 5, 0, Math.PI * 2)
          ctx.fill()
          break
      }

      // Draw velocity vector if moving
      if (obj.isMoving && (obj.velocity.x !== 0 || obj.velocity.y !== 0)) {
        ctx.strokeStyle = "#DC2626"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(obj.x + obj.width / 2, obj.y + obj.height / 2)
        ctx.lineTo(obj.x + obj.width / 2 + obj.velocity.x * 5, obj.y + obj.height / 2 + obj.velocity.y * 5)
        ctx.stroke()
      }
    })
  }, [objects, selectedObject, mission])

  // Physics simulation
  useEffect(() => {
    if (!isSimulating) return

    const interval = setInterval(() => {
      setObjects((prevObjects) => {
        return prevObjects.map((obj) => {
          if (!obj.isMoving) return obj

          // Apply gravity
          const newAcceleration = {
            x: obj.acceleration.x,
            y: obj.acceleration.y + physics.gravity * 0.01,
          }

          // Apply friction
          const newVelocity = {
            x: obj.velocity.x * (1 - physics.friction * 0.01) + newAcceleration.x,
            y: obj.velocity.y * (1 - physics.airResistance * 0.01) + newAcceleration.y,
          }

          // Update position
          const newX = Math.max(0, Math.min(800 - obj.width, obj.x + newVelocity.x))
          const newY = Math.max(0, Math.min(500 - obj.height, obj.y + newVelocity.y))

          // Ground collision
          if (newY >= 500 - obj.height) {
            return {
              ...obj,
              x: newX,
              y: 500 - obj.height,
              velocity: { x: newVelocity.x * 0.8, y: 0 },
              acceleration: { x: 0, y: 0 },
              isMoving: Math.abs(newVelocity.x) > 0.1,
            }
          }

          return {
            ...obj,
            x: newX,
            y: newY,
            velocity: newVelocity,
            acceleration: newAcceleration,
          }
        })
      })
    }, 16) // ~60 FPS

    return () => clearInterval(interval)
  }, [isSimulating, physics])

  // Check win condition
  useEffect(() => {
    const targetObj = objects.find((obj) => obj.id === mission.targetObject)
    if (
      targetObj &&
      Math.abs(targetObj.x - mission.targetPosition.x) < mission.tolerance &&
      Math.abs(targetObj.y - mission.targetPosition.y) < mission.tolerance
    ) {
      setIsSimulating(false)
      setScore(score + mission.points)
      setShowSuccess(true)
    }
  }, [objects, mission, score])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if clicking on an object
    const clickedObject = objects.find(
      (obj) => x >= obj.x && x <= obj.x + obj.width && y >= obj.y && y <= obj.y + obj.height,
    )

    if (clickedObject) {
      setSelectedObject(selectedObject === clickedObject.id ? null : clickedObject.id)
    } else if (draggedTool) {
      // Place new object
      const newObject: PhysicsObject = {
        id: `${draggedTool}-${Date.now()}`,
        type: draggedTool as any,
        x: x - 25,
        y: y - 25,
        width: 50,
        height: draggedTool === "ramp" ? 30 : 50,
        mass: toolbox.find((t) => t.type === draggedTool)?.mass || 1,
        velocity: { x: 0, y: 0 },
        acceleration: { x: 0, y: 0 },
        color: toolbox.find((t) => t.type === draggedTool)?.color || "#8B5CF6",
        isMoving: false,
        isDragging: false,
      }
      setObjects([...objects, newObject])
      setDraggedTool(null)
    } else {
      setSelectedObject(null)
    }
  }

  const startSimulation = () => {
    setIsSimulating(true)
    setObjects((prev) =>
      prev.map((obj) => ({
        ...obj,
        isMoving: true,
      })),
    )
  }

  const resetSimulation = () => {
    setIsSimulating(false)
    initializeMission()
    setSelectedObject(null)
  }

  const nextMission = () => {
    if (currentMission < missions.length - 1) {
      setCurrentMission(currentMission + 1)
      setShowSuccess(false)
    } else {
      alert("Congratulations! You've completed all missions!")
    }
  }

  const deleteSelectedObject = () => {
    if (selectedObject && !["cat", "ball", "rocket"].includes(selectedObject)) {
      setObjects(objects.filter((obj) => obj.id !== selectedObject))
      setSelectedObject(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Games
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary">⚛️ Force Builder</h1>
            <p className="text-muted-foreground">Build structures and learn physics!</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Mission {currentMission + 1}</p>
            <p className="text-lg font-bold text-primary">{score} points</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Toolbox */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Toolbox</CardTitle>
                <p className="text-sm text-muted-foreground">Click to select, then click on canvas to place</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {toolbox.map((tool) => (
                  <Button
                    key={tool.type}
                    variant={draggedTool === tool.type ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setDraggedTool(draggedTool === tool.type ? null : tool.type)}
                  >
                    <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: tool.color }} />
                    {tool.name}
                    <Badge variant="secondary" className="ml-auto">
                      {tool.mass}kg
                    </Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={startSimulation} disabled={isSimulating} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  {isSimulating ? "Running..." : "Start Simulation"}
                </Button>
                <Button onClick={resetSimulation} variant="outline" className="w-full bg-transparent">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button onClick={() => setShowSettings(true)} variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Physics Settings
                </Button>
                <Button onClick={() => setShowHint(true)} variant="outline" className="w-full">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Get Hint
                </Button>
                {selectedObject && !["cat", "ball", "rocket"].includes(selectedObject) && (
                  <Button onClick={deleteSelectedObject} variant="destructive" className="w-full">
                    Delete Selected
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Physics Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Gravity:</span>
                  <span>{physics.gravity} m/s²</span>
                </div>
                <div className="flex justify-between">
                  <span>Friction:</span>
                  <span>{physics.friction}</span>
                </div>
                <div className="flex justify-between">
                  <span>Air Resistance:</span>
                  <span>{physics.airResistance}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Game Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Mission Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{mission.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{mission.description}</p>
                  </div>
                  <Badge variant="outline">{mission.points} points</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-800">Objective:</p>
                  <p className="text-sm text-blue-700">{mission.objective}</p>
                </div>
              </CardContent>
            </Card>

            {/* Canvas */}
            <Card>
              <CardContent className="p-4">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={500}
                  className="border border-gray-300 rounded-lg cursor-crosshair bg-white"
                  onClick={handleCanvasClick}
                />
                <div className="mt-2 text-xs text-muted-foreground">
                  {draggedTool
                    ? `Click on canvas to place ${draggedTool}`
                    : selectedObject
                      ? `Selected: ${selectedObject} (click to deselect)`
                      : "Click objects to select them, or select a tool to place"}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Success Dialog */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Mission Complete!
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-lg">Excellent work, physicist!</p>
                <p className="text-sm text-muted-foreground">You've successfully completed "{mission.title}"</p>
              </div>

              <div className="bg-muted rounded-lg p-3">
                <div className="flex justify-between">
                  <span>Mission Points:</span>
                  <span className="font-bold text-primary">+{mission.points}</span>
                </div>
              </div>

              <Button className="w-full" onClick={nextMission}>
                {currentMission < missions.length - 1 ? "Next Mission" : "Complete Game"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Hint Dialog */}
        <Dialog open={showHint} onOpenChange={setShowHint}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Physics Hint
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">{mission.hint}</p>
              </div>
              <Button className="w-full" onClick={() => setShowHint(false)}>
                Got it!
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Physics Settings Dialog */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Physics Settings
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium">Gravity: {physics.gravity} m/s²</label>
                <Slider
                  value={[physics.gravity]}
                  onValueChange={([value]) => setPhysics({ ...physics, gravity: value })}
                  min={0}
                  max={20}
                  step={0.1}
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Friction: {physics.friction}</label>
                <Slider
                  value={[physics.friction]}
                  onValueChange={([value]) => setPhysics({ ...physics, friction: value })}
                  min={0}
                  max={1}
                  step={0.01}
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Air Resistance: {physics.airResistance}</label>
                <Slider
                  value={[physics.airResistance]}
                  onValueChange={([value]) => setPhysics({ ...physics, airResistance: value })}
                  min={0}
                  max={1}
                  step={0.01}
                  className="mt-2"
                />
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  setPhysics(mission.physics)
                  setShowSettings(false)
                }}
              >
                Reset to Default
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
