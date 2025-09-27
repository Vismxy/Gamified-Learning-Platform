"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Sword, Star, Trophy, Clock, Target, Lightbulb, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"

interface Quest {
  id: string
  title: string
  description: string
  type: "arithmetic" | "algebra" | "geometry" | "logic"
  difficulty: "easy" | "medium" | "hard"
  problem: string
  answer: number | string
  options?: string[]
  hint: string
  points: number
  timeLimit: number // in seconds
  story: string
}

interface GameState {
  currentQuest: number
  score: number
  level: number
  lives: number
  timeRemaining: number
  completedQuests: Set<string>
  streak: number
}

const quests: Quest[] = [
  {
    id: "village-supplies",
    title: "Village Supplies",
    description: "Help the village merchant count supplies",
    type: "arithmetic",
    difficulty: "easy",
    problem: "The merchant has 45 apples and buys 28 more. How many apples does he have now?",
    answer: 73,
    hint: "Add the original amount to the new amount: 45 + 28",
    points: 100,
    timeLimit: 60,
    story: "You arrive at a bustling village where the merchant needs help with inventory.",
  },
  {
    id: "dragon-treasure",
    title: "Dragon's Treasure",
    description: "Solve the riddle to unlock the treasure chest",
    type: "algebra",
    difficulty: "medium",
    problem: "If x + 15 = 32, what is the value of x?",
    answer: 17,
    hint: "Subtract 15 from both sides: x = 32 - 15",
    points: 200,
    timeLimit: 90,
    story: "A wise dragon guards a treasure chest with a mathematical lock.",
  },
  {
    id: "castle-geometry",
    title: "Castle Architecture",
    description: "Calculate the area to help build the castle",
    type: "geometry",
    difficulty: "medium",
    problem: "A rectangular castle courtyard is 20 meters long and 15 meters wide. What is its area?",
    answer: 300,
    hint: "Area of rectangle = length × width",
    points: 250,
    timeLimit: 75,
    story: "The royal architect needs your help designing the perfect courtyard.",
  },
  {
    id: "wizard-pattern",
    title: "Wizard's Pattern",
    description: "Complete the magical number sequence",
    type: "logic",
    difficulty: "hard",
    problem: "What comes next in the sequence: 2, 6, 12, 20, 30, ?",
    answer: 42,
    options: ["38", "40", "42", "44"],
    hint: "Look at the differences between consecutive numbers: +4, +6, +8, +10...",
    points: 300,
    timeLimit: 120,
    story: "An ancient wizard challenges you with a mystical number pattern.",
  },
  {
    id: "bridge-crossing",
    title: "Bridge Crossing",
    description: "Calculate the safe crossing time",
    type: "arithmetic",
    difficulty: "medium",
    problem: "A bridge can hold 500kg. If each person weighs 70kg, how many people can cross safely?",
    answer: 7,
    hint: "Divide the bridge capacity by the weight per person: 500 ÷ 70",
    points: 180,
    timeLimit: 80,
    story: "You must help travelers cross an ancient bridge safely.",
  },
]

export default function NumberQuestGame() {
  const router = useRouter()
  const [gameState, setGameState] = useState<GameState>({
    currentQuest: 0,
    score: 0,
    level: 1,
    lives: 3,
    timeRemaining: 0,
    completedQuests: new Set(),
    streak: 0,
  })
  const [userAnswer, setUserAnswer] = useState("")
  const [showHint, setShowHint] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [isPaused, setPaused] = useState(false)

  const currentQuest = quests[gameState.currentQuest]

  // Timer effect
  useEffect(() => {
    if (!gameStarted || isPaused || gameState.timeRemaining <= 0) return

    const timer = setInterval(() => {
      setGameState((prev) => {
        if (prev.timeRemaining <= 1) {
          // Time's up - wrong answer
          handleTimeUp()
          return prev
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameStarted, isPaused, gameState.timeRemaining])

  const startGame = () => {
    setGameStarted(true)
    setGameState((prev) => ({
      ...prev,
      timeRemaining: currentQuest.timeLimit,
    }))
  }

  const handleTimeUp = () => {
    setIsCorrect(false)
    setShowResult(true)
    setGameState((prev) => ({
      ...prev,
      lives: prev.lives - 1,
      streak: 0,
    }))
  }

  const submitAnswer = () => {
    if (!userAnswer.trim()) return

    const correct = userAnswer.toLowerCase().trim() === currentQuest.answer.toString().toLowerCase()
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      const bonusPoints = gameState.streak >= 3 ? 50 : 0
      const timeBonus = Math.floor(gameState.timeRemaining / 10) * 5
      const totalPoints = currentQuest.points + bonusPoints + timeBonus

      setGameState((prev) => ({
        ...prev,
        score: prev.score + totalPoints,
        completedQuests: new Set([...prev.completedQuests, currentQuest.id]),
        streak: prev.streak + 1,
        level: Math.floor((prev.score + totalPoints) / 1000) + 1,
      }))
    } else {
      setGameState((prev) => ({
        ...prev,
        lives: prev.lives - 1,
        streak: 0,
      }))
    }
  }

  const nextQuest = () => {
    if (gameState.currentQuest < quests.length - 1) {
      setGameState((prev) => ({
        ...prev,
        currentQuest: prev.currentQuest + 1,
        timeRemaining: quests[prev.currentQuest + 1].timeLimit,
      }))
      setUserAnswer("")
      setShowHint(false)
      setShowResult(false)
    } else {
      // Game completed
      alert("Congratulations! You've completed all quests!")
    }
  }

  const restartQuest = () => {
    setUserAnswer("")
    setShowHint(false)
    setShowResult(false)
    setGameState((prev) => ({
      ...prev,
      timeRemaining: currentQuest.timeLimit,
    }))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "arithmetic":
        return "🔢"
      case "algebra":
        return "📐"
      case "geometry":
        return "📏"
      case "logic":
        return "🧩"
      default:
        return "📊"
    }
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Games
            </Button>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-primary">📐 Number Quest</h1>
              <p className="text-muted-foreground">Embark on mathematical adventures!</p>
            </div>
            <div />
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome, Brave Mathematician!</CardTitle>
              <p className="text-muted-foreground">
                Journey through mystical lands solving mathematical puzzles to save the kingdom!
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <h3 className="font-semibold">Earn Points</h3>
                  <p className="text-sm text-muted-foreground">Solve problems to earn points and level up</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <h3 className="font-semibold">Beat the Clock</h3>
                  <p className="text-sm text-muted-foreground">Solve quickly for time bonuses</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <h3 className="font-semibold">Build Streaks</h3>
                  <p className="text-sm text-muted-foreground">Consecutive correct answers earn bonus points</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Star className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <h3 className="font-semibold">Use Hints</h3>
                  <p className="text-sm text-muted-foreground">Get help when you're stuck</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-center">Quest Preview</h3>
                <div className="grid gap-2">
                  {quests.map((quest, index) => (
                    <div key={quest.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getTypeIcon(quest.type)}</span>
                        <div>
                          <p className="font-medium">{quest.title}</p>
                          <p className="text-sm text-muted-foreground">{quest.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(quest.difficulty)}>{quest.difficulty}</Badge>
                        <Badge variant="outline">{quest.points} pts</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button size="lg" className="w-full" onClick={startGame}>
                <Sword className="h-5 w-5 mr-2" />
                Begin Quest
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (gameState.lives <= 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl text-red-600">Quest Failed</CardTitle>
              <p className="text-muted-foreground">You've run out of lives, but don't give up!</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-6xl">💀</div>
              <div className="space-y-2">
                <p className="text-lg font-semibold">Final Score: {gameState.score}</p>
                <p>
                  Quests Completed: {gameState.completedQuests.size}/{quests.length}
                </p>
                <p>Highest Level: {gameState.level}</p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => window.location.reload()}>Try Again</Button>
                <Button variant="outline" onClick={() => router.back()}>
                  Back to Games
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Games
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary">📐 Number Quest</h1>
            <p className="text-sm text-muted-foreground">
              Quest {gameState.currentQuest + 1} of {quests.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Level {gameState.level}</p>
            <p className="text-lg font-bold text-primary">{gameState.score} points</p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-sm text-muted-foreground">Lives</p>
              <p className="text-xl font-bold text-red-500">{"❤️".repeat(gameState.lives)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-sm text-muted-foreground">Streak</p>
              <p className="text-xl font-bold text-orange-500">{gameState.streak}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="text-xl font-bold text-blue-500">{formatTime(gameState.timeRemaining)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-sm text-muted-foreground">Progress</p>
              <Progress value={(gameState.completedQuests.size / quests.length) * 100} className="h-2 mt-1" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-sm text-muted-foreground">Difficulty</p>
              <Badge className={getDifficultyColor(currentQuest.difficulty)}>{currentQuest.difficulty}</Badge>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Quest Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getTypeIcon(currentQuest.type)}</span>
                    <div>
                      <CardTitle>{currentQuest.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{currentQuest.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{currentQuest.points} points</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Story */}
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm italic">{currentQuest.story}</p>
                </div>

                {/* Problem */}
                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
                  <h3 className="font-semibold mb-3">Mathematical Challenge:</h3>
                  <p className="text-lg">{currentQuest.problem}</p>
                </div>

                {/* Answer Input */}
                <div className="space-y-4">
                  {currentQuest.options ? (
                    <div className="grid gap-2 md:grid-cols-2">
                      {currentQuest.options.map((option, index) => (
                        <Button
                          key={index}
                          variant={userAnswer === option ? "default" : "outline"}
                          className="h-12 text-left justify-start"
                          onClick={() => setUserAnswer(option)}
                        >
                          {String.fromCharCode(65 + index)}. {option}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter your answer..."
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && submitAnswer()}
                        className="text-lg"
                      />
                      <Button onClick={submitAnswer} disabled={!userAnswer.trim()}>
                        Submit
                      </Button>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowHint(true)} disabled={showHint}>
                    <Lightbulb className="h-4 w-4 mr-2" />
                    {showHint ? "Hint Shown" : "Get Hint"}
                  </Button>
                  <Button variant="outline" onClick={restartQuest}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restart Quest
                  </Button>
                  {currentQuest.options && (
                    <Button onClick={submitAnswer} disabled={!userAnswer} className="ml-auto">
                      Submit Answer
                    </Button>
                  )}
                </div>

                {/* Hint */}
                {showHint && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Hint:</span>
                    </div>
                    <p className="text-yellow-700">{currentQuest.hint}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            {/* Quest Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Quest Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quests.map((quest, index) => (
                    <div
                      key={quest.id}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        index === gameState.currentQuest
                          ? "bg-primary/10 border border-primary/20"
                          : gameState.completedQuests.has(quest.id)
                            ? "bg-green-50 border border-green-200"
                            : "bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{getTypeIcon(quest.type)}</span>
                        <span className="text-sm font-medium">{quest.title}</span>
                      </div>
                      {gameState.completedQuests.has(quest.id) ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          ✓
                        </Badge>
                      ) : index === gameState.currentQuest ? (
                        <Badge variant="default">Current</Badge>
                      ) : (
                        <Badge variant="outline">Locked</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>First Quest</span>
                    <span>{gameState.completedQuests.size > 0 ? "✅" : "⏳"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Speed Demon</span>
                    <span>{gameState.streak >= 3 ? "✅" : "⏳"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Math Master</span>
                    <span>{gameState.score >= 1000 ? "✅" : "⏳"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Quest Completer</span>
                    <span>{gameState.completedQuests.size === quests.length ? "✅" : "⏳"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Result Dialog */}
        <Dialog open={showResult} onOpenChange={setShowResult}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <Star className="h-5 w-5 text-yellow-500" />
                    Correct!
                  </>
                ) : (
                  <>
                    <Target className="h-5 w-5 text-red-500" />
                    Incorrect
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-2">{isCorrect ? "🎉" : "😔"}</div>
                <p className="text-lg">
                  {isCorrect ? "Well done, brave mathematician!" : "Don't give up! Try the next quest."}
                </p>
                {!isCorrect && (
                  <p className="text-sm text-muted-foreground mt-2">
                    The correct answer was: <strong>{currentQuest.answer}</strong>
                  </p>
                )}
              </div>

              {isCorrect && (
                <div className="bg-muted rounded-lg p-3 space-y-2">
                  <div className="flex justify-between">
                    <span>Base Points:</span>
                    <span>+{currentQuest.points}</span>
                  </div>
                  {gameState.streak >= 3 && (
                    <div className="flex justify-between">
                      <span>Streak Bonus:</span>
                      <span>+50</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Time Bonus:</span>
                    <span>+{Math.floor(gameState.timeRemaining / 10) * 5}</span>
                  </div>
                </div>
              )}

              <Button className="w-full" onClick={nextQuest}>
                {gameState.currentQuest < quests.length - 1 ? "Next Quest" : "Complete Adventure"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
