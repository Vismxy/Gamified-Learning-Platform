"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Beaker, Zap, Trophy, Star, RotateCcw, HelpCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface Element {
  symbol: string
  name: string
  atomicNumber: number
  category: string
  color: string
  properties: {
    state: string
    reactivity: string
    uses: string[]
  }
}

interface Reaction {
  id: string
  reactants: string[]
  products: string[]
  type: string
  description: string
  animation: string
  points: number
}

const elements: Element[] = [
  {
    symbol: "H",
    name: "Hydrogen",
    atomicNumber: 1,
    category: "nonmetal",
    color: "bg-blue-500",
    properties: {
      state: "gas",
      reactivity: "high",
      uses: ["fuel", "water formation", "ammonia production"],
    },
  },
  {
    symbol: "O",
    name: "Oxygen",
    atomicNumber: 8,
    category: "nonmetal",
    color: "bg-red-500",
    properties: {
      state: "gas",
      reactivity: "high",
      uses: ["breathing", "combustion", "water formation"],
    },
  },
  {
    symbol: "Na",
    name: "Sodium",
    atomicNumber: 11,
    category: "metal",
    color: "bg-yellow-500",
    properties: {
      state: "solid",
      reactivity: "very high",
      uses: ["salt formation", "batteries", "street lights"],
    },
  },
  {
    symbol: "Cl",
    name: "Chlorine",
    atomicNumber: 17,
    category: "nonmetal",
    color: "bg-green-500",
    properties: {
      state: "gas",
      reactivity: "high",
      uses: ["disinfection", "salt formation", "plastics"],
    },
  },
  {
    symbol: "C",
    name: "Carbon",
    atomicNumber: 6,
    category: "nonmetal",
    color: "bg-gray-800",
    properties: {
      state: "solid",
      reactivity: "moderate",
      uses: ["organic compounds", "diamonds", "graphite"],
    },
  },
  {
    symbol: "Ca",
    name: "Calcium",
    atomicNumber: 20,
    category: "metal",
    color: "bg-orange-500",
    properties: {
      state: "solid",
      reactivity: "high",
      uses: ["bones", "concrete", "steel production"],
    },
  },
]

const reactions: Reaction[] = [
  {
    id: "water-formation",
    reactants: ["H", "H", "O"],
    products: ["H2O"],
    type: "synthesis",
    description: "Two hydrogen atoms combine with one oxygen atom to form water!",
    animation: "bubble-formation",
    points: 100,
  },
  {
    id: "salt-formation",
    reactants: ["Na", "Cl"],
    products: ["NaCl"],
    type: "ionic",
    description: "Sodium and chlorine form table salt through ionic bonding!",
    animation: "crystal-formation",
    points: 150,
  },
  {
    id: "combustion",
    reactants: ["C", "O", "O"],
    products: ["CO2"],
    type: "combustion",
    description: "Carbon burns in oxygen to produce carbon dioxide!",
    animation: "flame-effect",
    points: 120,
  },
]

export default function ElementExplorerGame() {
  const router = useRouter()
  const [selectedElements, setSelectedElements] = useState<string[]>([])
  const [currentReaction, setCurrentReaction] = useState<Reaction | null>(null)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [showReactionDialog, setShowReactionDialog] = useState(false)
  const [showElementInfo, setShowElementInfo] = useState<Element | null>(null)
  const [reactionAnimation, setReactionAnimation] = useState("")
  const [completedReactions, setCompletedReactions] = useState<Set<string>>(new Set())
  const [hints, setHints] = useState(3)

  const handleElementClick = (element: Element) => {
    if (selectedElements.length < 3) {
      setSelectedElements([...selectedElements, element.symbol])
    }
  }

  const handleElementInfo = (element: Element) => {
    setShowElementInfo(element)
  }

  const checkReaction = () => {
    if (selectedElements.length === 0) return

    const reaction = reactions.find((r) => {
      const sortedReactants = [...r.reactants].sort()
      const sortedSelected = [...selectedElements].sort()
      return JSON.stringify(sortedReactants) === JSON.stringify(sortedSelected)
    })

    if (reaction && !completedReactions.has(reaction.id)) {
      setCurrentReaction(reaction)
      setScore(score + reaction.points)
      setReactionAnimation(reaction.animation)
      setShowReactionDialog(true)
      setCompletedReactions(new Set([...completedReactions, reaction.id]))

      // Level up logic
      if (completedReactions.size + 1 >= level * 2) {
        setLevel(level + 1)
      }
    } else if (reaction && completedReactions.has(reaction.id)) {
      // Already completed reaction
      setCurrentReaction(reaction)
      setShowReactionDialog(true)
    } else {
      // Invalid reaction - show hint
      if (hints > 0) {
        setHints(hints - 1)
        // Show hint logic here
      }
    }
  }

  const resetLab = () => {
    setSelectedElements([])
    setCurrentReaction(null)
    setReactionAnimation("")
  }

  const getHint = () => {
    if (hints > 0) {
      setHints(hints - 1)
      // Show available reactions hint
      const availableReactions = reactions.filter((r) => !completedReactions.has(r.id))
      if (availableReactions.length > 0) {
        const hint = availableReactions[0]
        alert(`Try combining: ${hint.reactants.join(" + ")} to make ${hint.products[0]}`)
      }
    }
  }

  const progressPercentage = (completedReactions.size / reactions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Games
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary">🧪 Element Explorer</h1>
            <p className="text-muted-foreground">Discover chemistry through interactive experiments!</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Level {level}</p>
            <p className="text-lg font-bold text-primary">{score} points</p>
          </div>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Lab Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedReactions.size}/{reactions.length} reactions discovered
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Periodic Table Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="h-5 w-5" />
                  Element Laboratory
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Click elements to select them, then mix to create reactions!
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                  {elements.map((element) => (
                    <div key={element.symbol} className="relative">
                      <Button
                        variant="outline"
                        className={`w-full h-20 flex flex-col items-center justify-center p-2 ${element.color} text-white hover:opacity-80 transition-all duration-200 ${
                          selectedElements.includes(element.symbol) ? "ring-2 ring-yellow-400 scale-105" : ""
                        }`}
                        onClick={() => handleElementClick(element)}
                      >
                        <span className="text-lg font-bold">{element.symbol}</span>
                        <span className="text-xs">{element.atomicNumber}</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-white rounded-full shadow-md"
                        onClick={() => handleElementInfo(element)}
                      >
                        <HelpCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Selected Elements Display */}
                <div className="bg-muted rounded-lg p-4 mb-4">
                  <h3 className="font-medium mb-2">Selected Elements:</h3>
                  <div className="flex items-center gap-2 mb-3">
                    {selectedElements.length === 0 ? (
                      <span className="text-muted-foreground">No elements selected</span>
                    ) : (
                      selectedElements.map((symbol, index) => (
                        <div key={index} className="flex items-center">
                          <Badge variant="secondary" className="text-lg px-3 py-1">
                            {symbol}
                          </Badge>
                          {index < selectedElements.length - 1 && <span className="mx-2 text-muted-foreground">+</span>}
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={checkReaction}
                      disabled={selectedElements.length === 0}
                      className="flex items-center gap-2"
                    >
                      <Zap className="h-4 w-4" />
                      Mix Elements
                    </Button>
                    <Button variant="outline" onClick={resetLab}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Clear Lab
                    </Button>
                    <Button variant="outline" onClick={getHint} disabled={hints === 0}>
                      💡 Hint ({hints} left)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Lab Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Current Level:</span>
                  <Badge variant="secondary">Level {level}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Total Score:</span>
                  <span className="font-bold text-primary">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span>Reactions Found:</span>
                  <span>
                    {completedReactions.size}/{reactions.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Hints Remaining:</span>
                  <span>{hints}</span>
                </div>
              </CardContent>
            </Card>

            {/* Discovered Reactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Discovered Reactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {reactions.map((reaction) => (
                    <div
                      key={reaction.id}
                      className={`p-3 rounded-lg border ${
                        completedReactions.has(reaction.id)
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {reaction.reactants.join(" + ")} → {reaction.products[0]}
                        </span>
                        {completedReactions.has(reaction.id) ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            ✓ Found
                          </Badge>
                        ) : (
                          <Badge variant="outline">? Unknown</Badge>
                        )}
                      </div>
                      {completedReactions.has(reaction.id) && (
                        <p className="text-xs text-muted-foreground mt-1">+{reaction.points} points</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reaction Success Dialog */}
        <Dialog open={showReactionDialog} onOpenChange={setShowReactionDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                {currentReaction ? "Reaction Discovered!" : "Reaction"}
              </DialogTitle>
            </DialogHeader>
            {currentReaction && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">
                    {reactionAnimation === "bubble-formation" && "💧"}
                    {reactionAnimation === "crystal-formation" && "🧂"}
                    {reactionAnimation === "flame-effect" && "🔥"}
                  </div>
                  <h3 className="text-lg font-bold">
                    {currentReaction.reactants.join(" + ")} → {currentReaction.products[0]}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">{currentReaction.description}</p>
                </div>

                <div className="bg-muted rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Reaction Type:</span>
                    <Badge variant="secondary">{currentReaction.type}</Badge>
                  </div>
                  {!completedReactions.has(currentReaction.id) && (
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm font-medium">Points Earned:</span>
                      <span className="text-primary font-bold">+{currentReaction.points}</span>
                    </div>
                  )}
                </div>

                <Button className="w-full" onClick={() => setShowReactionDialog(false)}>
                  Continue Experimenting
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Element Info Dialog */}
        <Dialog open={!!showElementInfo} onOpenChange={() => setShowElementInfo(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {showElementInfo && (
                  <>
                    <div
                      className={`w-8 h-8 rounded ${showElementInfo.color} flex items-center justify-center text-white font-bold`}
                    >
                      {showElementInfo.symbol}
                    </div>
                    {showElementInfo.name}
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            {showElementInfo && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Atomic Number</p>
                    <p className="text-lg">{showElementInfo.atomicNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Category</p>
                    <Badge variant="outline">{showElementInfo.category}</Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Properties</p>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>State:</strong> {showElementInfo.properties.state}
                    </p>
                    <p>
                      <strong>Reactivity:</strong> {showElementInfo.properties.reactivity}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Common Uses</p>
                  <div className="flex flex-wrap gap-1">
                    {showElementInfo.properties.uses.map((use, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {use}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full" onClick={() => setShowElementInfo(null)}>
                  Close
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
