"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Microscope, Leaf, Heart, Eye, Trophy, Lightbulb, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"

interface Organism {
  id: string
  name: string
  type: "plant" | "animal" | "microbe"
  habitat: string
  diet: string
  characteristics: string[]
  image: string
  discovered: boolean
  points: number
}

interface EcosystemElement {
  id: string
  name: string
  type: "producer" | "primary_consumer" | "secondary_consumer" | "decomposer"
  energy: number
  population: number
  connections: string[]
  position: { x: number; y: number }
}

interface Experiment {
  id: string
  title: string
  description: string
  type: "dissection" | "ecosystem" | "cell_study" | "genetics"
  objective: string
  steps: string[]
  materials: string[]
  expectedResult: string
  points: number
  completed: boolean
}

const organisms: Organism[] = [
  {
    id: "oak-tree",
    name: "Oak Tree",
    type: "plant",
    habitat: "Forest",
    diet: "Photosynthesis",
    characteristics: ["Produces oxygen", "Deep root system", "Deciduous leaves", "Acorn seeds"],
    image: "🌳",
    discovered: false,
    points: 100,
  },
  {
    id: "rabbit",
    name: "Rabbit",
    type: "animal",
    habitat: "Grassland",
    diet: "Herbivore",
    characteristics: ["Fast reproduction", "Keen hearing", "Powerful hind legs", "Herbivorous diet"],
    image: "🐰",
    discovered: false,
    points: 150,
  },
  {
    id: "hawk",
    name: "Red-tailed Hawk",
    type: "animal",
    habitat: "Forest/Grassland",
    diet: "Carnivore",
    characteristics: ["Sharp talons", "Excellent eyesight", "Soaring flight", "Apex predator"],
    image: "🦅",
    discovered: false,
    points: 200,
  },
  {
    id: "bacteria",
    name: "E. coli Bacteria",
    type: "microbe",
    habitat: "Various",
    diet: "Decomposer",
    characteristics: ["Single-celled", "Rapid reproduction", "Breaks down organic matter", "Microscopic"],
    image: "🦠",
    discovered: false,
    points: 120,
  },
  {
    id: "mushroom",
    name: "Shiitake Mushroom",
    type: "plant",
    habitat: "Forest floor",
    diet: "Decomposer",
    characteristics: ["Fungal network", "Breaks down dead wood", "Spore reproduction", "Nutrient cycling"],
    image: "🍄",
    discovered: false,
    points: 130,
  },
  {
    id: "bee",
    name: "Honey Bee",
    type: "animal",
    habitat: "Various",
    diet: "Herbivore",
    characteristics: ["Pollinator", "Social insect", "Produces honey", "Waggle dance communication"],
    image: "🐝",
    discovered: false,
    points: 180,
  },
]

const experiments: Experiment[] = [
  {
    id: "plant-cell-study",
    title: "Plant Cell Structure",
    description: "Examine plant cells under a microscope to identify key organelles",
    type: "cell_study",
    objective: "Identify chloroplasts, cell wall, and nucleus in plant cells",
    steps: [
      "Prepare a thin slice of onion skin",
      "Place on microscope slide with water",
      "Add iodine stain to highlight structures",
      "Observe under 40x magnification",
      "Identify and label cell structures",
    ],
    materials: ["Microscope", "Onion", "Iodine stain", "Slides", "Cover slips"],
    expectedResult: "Clear view of rectangular cells with visible nucleus and cell walls",
    points: 250,
    completed: false,
  },
  {
    id: "ecosystem-balance",
    title: "Ecosystem Food Web",
    description: "Build a balanced ecosystem and observe energy flow",
    type: "ecosystem",
    objective: "Create a stable food web with proper energy transfer",
    steps: [
      "Place producers (plants) as the base",
      "Add primary consumers (herbivores)",
      "Include secondary consumers (carnivores)",
      "Add decomposers to complete the cycle",
      "Observe population changes over time",
    ],
    materials: ["Ecosystem simulator", "Various organism cards", "Energy counters"],
    expectedResult: "Stable populations with energy flowing from producers to top predators",
    points: 300,
    completed: false,
  },
  {
    id: "heart-dissection",
    title: "Heart Anatomy",
    description: "Virtual dissection to understand heart structure and function",
    type: "dissection",
    objective: "Identify the four chambers and major blood vessels of the heart",
    steps: [
      "Examine the external heart structure",
      "Make careful incisions to reveal chambers",
      "Identify left and right atria",
      "Locate left and right ventricles",
      "Trace blood flow through the heart",
    ],
    materials: ["Virtual heart model", "Digital scalpel", "Anatomy guide"],
    expectedResult: "Complete understanding of heart chambers and blood circulation",
    points: 350,
    completed: false,
  },
]

export default function LifeLabGame() {
  const router = useRouter()
  const [discoveredOrganisms, setDiscoveredOrganisms] = useState<Set<string>>(new Set())
  const [completedExperiments, setCompletedExperiments] = useState<Set<string>>(new Set())
  const [score, setScore] = useState(0)
  const [currentExperiment, setCurrentExperiment] = useState<Experiment | null>(null)
  const [experimentStep, setExperimentStep] = useState(0)
  const [showOrganismDialog, setShowOrganismDialog] = useState<Organism | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [ecosystemElements, setEcosystemElements] = useState<EcosystemElement[]>([])
  const [selectedTab, setSelectedTab] = useState("explore")

  // Initialize ecosystem
  useEffect(() => {
    const initialEcosystem: EcosystemElement[] = [
      {
        id: "grass",
        name: "Grass",
        type: "producer",
        energy: 100,
        population: 1000,
        connections: [],
        position: { x: 100, y: 300 },
      },
      {
        id: "rabbit-pop",
        name: "Rabbit Population",
        type: "primary_consumer",
        energy: 80,
        population: 50,
        connections: ["grass"],
        position: { x: 300, y: 250 },
      },
      {
        id: "hawk-pop",
        name: "Hawk Population",
        type: "secondary_consumer",
        energy: 60,
        population: 5,
        connections: ["rabbit-pop"],
        position: { x: 500, y: 200 },
      },
      {
        id: "decomposer",
        name: "Bacteria & Fungi",
        type: "decomposer",
        energy: 40,
        population: 10000,
        connections: ["grass", "rabbit-pop", "hawk-pop"],
        position: { x: 300, y: 400 },
      },
    ]
    setEcosystemElements(initialEcosystem)
  }, [])

  const discoverOrganism = (organism: Organism) => {
    if (!discoveredOrganisms.has(organism.id)) {
      setDiscoveredOrganisms(new Set([...discoveredOrganisms, organism.id]))
      setScore(score + organism.points)
      setShowOrganismDialog(organism)
    }
  }

  const startExperiment = (experiment: Experiment) => {
    setCurrentExperiment(experiment)
    setExperimentStep(0)
  }

  const nextExperimentStep = () => {
    if (currentExperiment && experimentStep < currentExperiment.steps.length - 1) {
      setExperimentStep(experimentStep + 1)
    } else if (currentExperiment) {
      // Complete experiment
      setCompletedExperiments(new Set([...completedExperiments, currentExperiment.id]))
      setScore(score + currentExperiment.points)
      setCurrentExperiment(null)
      setExperimentStep(0)
    }
  }

  const resetExperiment = () => {
    setCurrentExperiment(null)
    setExperimentStep(0)
  }

  const getExperimentIcon = (type: string) => {
    switch (type) {
      case "dissection":
        return "🔬"
      case "ecosystem":
        return "🌿"
      case "cell_study":
        return "🧬"
      case "genetics":
        return "🧪"
      default:
        return "🔬"
    }
  }

  const getOrganismTypeColor = (type: string) => {
    switch (type) {
      case "plant":
        return "bg-green-100 text-green-800"
      case "animal":
        return "bg-blue-100 text-blue-800"
      case "microbe":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const progressPercentage = (discoveredOrganisms.size / organisms.length) * 100
  const experimentProgress = (completedExperiments.size / experiments.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Games
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary">🧬 Life Lab</h1>
            <p className="text-muted-foreground">Explore the mysteries of life and biology!</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Biologist Level</p>
            <p className="text-lg font-bold text-primary">{score} points</p>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Organisms Discovered</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold">
                      {discoveredOrganisms.size}/{organisms.length}
                    </p>
                    <Progress value={progressPercentage} className="flex-1 h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Microscope className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Experiments Completed</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold">
                      {completedExperiments.size}/{experiments.length}
                    </p>
                    <Progress value={experimentProgress} className="flex-1 h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Trophy className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Score</p>
                  <p className="text-2xl font-bold text-primary">{score}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="explore">
              <Eye className="h-4 w-4 mr-2" />
              Explore
            </TabsTrigger>
            <TabsTrigger value="experiments">
              <Microscope className="h-4 w-4 mr-2" />
              Experiments
            </TabsTrigger>
            <TabsTrigger value="ecosystem">
              <Leaf className="h-4 w-4 mr-2" />
              Ecosystem
            </TabsTrigger>
            <TabsTrigger value="anatomy">
              <Heart className="h-4 w-4 mr-2" />
              Anatomy
            </TabsTrigger>
          </TabsList>

          {/* Explore Tab */}
          <TabsContent value="explore">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {organisms.map((organism) => (
                <Card
                  key={organism.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    discoveredOrganisms.has(organism.id) ? "border-green-200 bg-green-50" : ""
                  }`}
                  onClick={() => discoverOrganism(organism)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{organism.image}</span>
                        <div>
                          <CardTitle className="text-lg">{organism.name}</CardTitle>
                          <Badge className={getOrganismTypeColor(organism.type)}>{organism.type}</Badge>
                        </div>
                      </div>
                      {discoveredOrganisms.has(organism.id) ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          ✓ Discovered
                        </Badge>
                      ) : (
                        <Badge variant="outline">? Unknown</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {discoveredOrganisms.has(organism.id) ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Habitat:</span>
                          <span>{organism.habitat}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Diet:</span>
                          <span>{organism.diet}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Key Features:</span>
                          <ul className="list-disc list-inside mt-1 text-xs text-muted-foreground">
                            {organism.characteristics.slice(0, 2).map((char, index) => (
                              <li key={index}>{char}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Click to discover this organism and learn about its characteristics!
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Experiments Tab */}
          <TabsContent value="experiments">
            {currentExperiment ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getExperimentIcon(currentExperiment.type)}</span>
                      <div>
                        <CardTitle>{currentExperiment.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{currentExperiment.description}</p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={resetExperiment}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Exit Experiment
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Objective */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-2">Objective:</h3>
                    <p className="text-blue-700">{currentExperiment.objective}</p>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>
                        Step {experimentStep + 1} of {currentExperiment.steps.length}
                      </span>
                    </div>
                    <Progress value={((experimentStep + 1) / currentExperiment.steps.length) * 100} className="h-3" />
                  </div>

                  {/* Current Step */}
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">Current Step:</h3>
                    <p className="text-lg">{currentExperiment.steps[experimentStep]}</p>
                  </div>

                  {/* Materials */}
                  <div>
                    <h3 className="font-semibold mb-2">Materials Available:</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentExperiment.materials.map((material, index) => (
                        <Badge key={index} variant="outline">
                          {material}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button onClick={nextExperimentStep} className="flex-1">
                      {experimentStep < currentExperiment.steps.length - 1 ? "Next Step" : "Complete Experiment"}
                    </Button>
                    <Button variant="outline" onClick={() => setShowHint(true)}>
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Hint
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {experiments.map((experiment) => (
                  <Card key={experiment.id} className="cursor-pointer hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getExperimentIcon(experiment.type)}</span>
                          <div>
                            <CardTitle className="text-lg">{experiment.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">{experiment.description}</p>
                          </div>
                        </div>
                        {completedExperiments.has(experiment.id) ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            ✓ Complete
                          </Badge>
                        ) : (
                          <Badge variant="outline">{experiment.points} pts</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{experiment.objective}</p>
                      <Button
                        onClick={() => startExperiment(experiment)}
                        disabled={completedExperiments.has(experiment.id)}
                        className="w-full"
                      >
                        {completedExperiments.has(experiment.id) ? "Completed" : "Start Experiment"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Ecosystem Tab */}
          <TabsContent value="ecosystem">
            <Card>
              <CardHeader>
                <CardTitle>Ecosystem Simulator</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Observe how energy flows through different trophic levels in an ecosystem
                </p>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gradient-to-b from-sky-100 to-green-100 rounded-lg p-6 h-96 overflow-hidden">
                  {/* Sun */}
                  <div className="absolute top-4 right-4 text-4xl">☀️</div>

                  {/* Ecosystem Elements */}
                  {ecosystemElements.map((element) => (
                    <div
                      key={element.id}
                      className="absolute bg-white rounded-lg p-3 shadow-md border-2 border-gray-200 min-w-24 text-center"
                      style={{
                        left: element.position.x,
                        top: element.position.y,
                        borderColor:
                          element.type === "producer"
                            ? "#22C55E"
                            : element.type === "primary_consumer"
                              ? "#3B82F6"
                              : element.type === "secondary_consumer"
                                ? "#EF4444"
                                : "#8B5CF6",
                      }}
                    >
                      <div className="text-lg mb-1">
                        {element.type === "producer" && "🌱"}
                        {element.type === "primary_consumer" && "🐰"}
                        {element.type === "secondary_consumer" && "🦅"}
                        {element.type === "decomposer" && "🍄"}
                      </div>
                      <p className="text-xs font-medium">{element.name}</p>
                      <p className="text-xs text-muted-foreground">Pop: {element.population}</p>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                        <div className="bg-green-500 h-1 rounded-full" style={{ width: `${element.energy}%` }}></div>
                      </div>
                    </div>
                  ))}

                  {/* Energy Flow Arrows */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#059669" />
                      </marker>
                    </defs>
                    <line
                      x1="150"
                      y1="315"
                      x2="280"
                      y2="280"
                      stroke="#059669"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                    <line
                      x1="350"
                      y1="265"
                      x2="480"
                      y2="230"
                      stroke="#059669"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                    <line
                      x1="320"
                      y1="380"
                      x2="180"
                      y2="340"
                      stroke="#8B5CF6"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                      strokeDasharray="5,5"
                    />
                  </svg>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Producers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span>Primary Consumers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Secondary Consumers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <span>Decomposers</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Anatomy Tab */}
          <TabsContent value="anatomy">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Human Heart
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-6 h-64 flex items-center justify-center">
                    <div className="text-6xl">❤️</div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="bg-white/80 p-2 rounded shadow">
                          <p className="font-medium">Right Atrium</p>
                          <p className="text-muted-foreground">Receives deoxygenated blood</p>
                        </div>
                        <div className="bg-white/80 p-2 rounded shadow">
                          <p className="font-medium">Left Atrium</p>
                          <p className="text-muted-foreground">Receives oxygenated blood</p>
                        </div>
                        <div className="bg-white/80 p-2 rounded shadow">
                          <p className="font-medium">Right Ventricle</p>
                          <p className="text-muted-foreground">Pumps to lungs</p>
                        </div>
                        <div className="bg-white/80 p-2 rounded shadow">
                          <p className="font-medium">Left Ventricle</p>
                          <p className="text-muted-foreground">Pumps to body</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full mt-4" onClick={() => startExperiment(experiments[2])}>
                    Start Heart Dissection
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Microscope className="h-5 w-5 text-blue-500" />
                    Cell Structure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6 h-64">
                    <div className="absolute inset-4 border-2 border-green-600 rounded-lg">
                      <div className="absolute top-2 left-2 w-8 h-8 bg-blue-600 rounded-full"></div>
                      <div className="absolute top-4 right-4 w-4 h-4 bg-green-600 rounded-full"></div>
                      <div className="absolute bottom-4 left-4 w-6 h-6 bg-yellow-600 rounded"></div>
                      <div className="absolute bottom-2 right-2 w-3 h-8 bg-purple-600 rounded"></div>
                    </div>
                    <div className="absolute bottom-2 left-2 text-xs space-y-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>Nucleus</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span>Chloroplast</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-yellow-600 rounded"></div>
                        <span>Mitochondria</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full mt-4" onClick={() => startExperiment(experiments[0])}>
                    Study Plant Cells
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Organism Discovery Dialog */}
        <Dialog open={!!showOrganismDialog} onOpenChange={() => setShowOrganismDialog(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                New Discovery!
              </DialogTitle>
            </DialogHeader>
            {showOrganismDialog && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">{showOrganismDialog.image}</div>
                  <h3 className="text-xl font-bold">{showOrganismDialog.name}</h3>
                  <Badge className={getOrganismTypeColor(showOrganismDialog.type)}>{showOrganismDialog.type}</Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Habitat:</span>
                    <span>{showOrganismDialog.habitat}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Diet:</span>
                    <span>{showOrganismDialog.diet}</span>
                  </div>
                  <div>
                    <span className="font-medium">Characteristics:</span>
                    <ul className="list-disc list-inside mt-1 text-sm text-muted-foreground">
                      {showOrganismDialog.characteristics.map((char, index) => (
                        <li key={index}>{char}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-3">
                  <div className="flex justify-between">
                    <span>Points Earned:</span>
                    <span className="font-bold text-primary">+{showOrganismDialog.points}</span>
                  </div>
                </div>

                <Button className="w-full" onClick={() => setShowOrganismDialog(null)}>
                  Continue Exploring
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Hint Dialog */}
        <Dialog open={showHint} onOpenChange={setShowHint}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Biology Hint
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">
                  {currentExperiment?.type === "cell_study" &&
                    "Look for the rectangular shape of plant cells and the green chloroplasts that help with photosynthesis!"}
                  {currentExperiment?.type === "dissection" &&
                    "Remember that the heart has four chambers - two atria (upper) and two ventricles (lower)."}
                  {currentExperiment?.type === "ecosystem" &&
                    "Energy flows from producers to consumers. Each level loses about 90% of energy as heat!"}
                  {!currentExperiment &&
                    "Click on organisms to discover them and learn about their unique characteristics!"}
                </p>
              </div>
              <Button className="w-full" onClick={() => setShowHint(false)}>
                Got it!
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
