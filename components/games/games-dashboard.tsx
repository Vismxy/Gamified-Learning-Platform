"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Star, Clock, Users, Play, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import type { User } from "@/types/user"

interface GamesDashboardProps {
  user: User
}

interface GameProgress {
  id: string
  name: string
  subject: string
  icon: string
  description: string
  progress: number
  level: number
  maxLevel: number
  isUnlocked: boolean
  lastPlayed?: Date
  timeSpent: number // in minutes
  achievements: number
}

export function GamesDashboard({ user }: GamesDashboardProps) {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const router = useRouter()

  const games: GameProgress[] = [
    {
      id: "element-explorer",
      name: "Element Explorer",
      subject: "Chemistry",
      icon: "🧪",
      description: "Explore the periodic table and create chemical reactions in this interactive lab simulation.",
      progress: 65,
      level: 3,
      maxLevel: 10,
      isUnlocked: true,
      lastPlayed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      timeSpent: 120,
      achievements: 8,
    },
    {
      id: "number-quest",
      name: "Number Quest",
      subject: "Mathematics",
      icon: "📐",
      description: "Embark on mathematical adventures solving puzzles and conquering numerical challenges.",
      progress: 45,
      level: 2,
      maxLevel: 12,
      isUnlocked: true,
      lastPlayed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      timeSpent: 85,
      achievements: 5,
    },
    {
      id: "force-builder",
      name: "Force Builder",
      subject: "Physics",
      icon: "⚛️",
      description: "Build structures and machines while learning about forces, motion, and energy.",
      progress: 30,
      level: 1,
      maxLevel: 8,
      isUnlocked: true,
      lastPlayed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      timeSpent: 45,
      achievements: 3,
    },
    {
      id: "life-lab",
      name: "Life Lab",
      subject: "Biology",
      icon: "🧬",
      description: "Explore ecosystems, dissect organisms, and discover the mysteries of life.",
      progress: 0,
      level: 1,
      maxLevel: 9,
      isUnlocked: user.grade >= 8, // Unlock for higher grades
      timeSpent: 0,
      achievements: 0,
    },
  ]

  const totalProgress = Math.round(games.reduce((sum, game) => sum + game.progress, 0) / games.length)
  const totalAchievements = games.reduce((sum, game) => sum + game.achievements, 0)
  const totalTimeSpent = games.reduce((sum, game) => sum + game.timeSpent, 0)

  const handlePlayGame = (gameId: string) => {
    router.push(`/games/${gameId}`)
  }

  const formatTimeSpent = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Progress</p>
                <p className="text-2xl font-bold">{totalProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Star className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Achievements</p>
                <p className="text-2xl font-bold">{totalAchievements}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time Played</p>
                <p className="text-2xl font-bold">{formatTimeSpent(totalTimeSpent)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rank</p>
                <p className="text-2xl font-bold">#12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Games Grid */}
      <Tabs defaultValue="all-games" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all-games">All Games</TabsTrigger>
          <TabsTrigger value="chemistry">Chemistry</TabsTrigger>
          <TabsTrigger value="mathematics">Math</TabsTrigger>
          <TabsTrigger value="physics">Physics</TabsTrigger>
          <TabsTrigger value="biology">Biology</TabsTrigger>
        </TabsList>

        <TabsContent value="all-games">
          <div className="grid gap-6 md:grid-cols-2">
            {games.map((game) => (
              <Card key={game.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{game.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{game.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {game.subject}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Level {game.level}</p>
                      <p className="text-xs text-muted-foreground">of {game.maxLevel}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{game.description}</p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{game.progress}%</span>
                    </div>
                    <Progress value={game.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {game.achievements}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeSpent(game.timeSpent)}
                      </span>
                    </div>
                    {game.lastPlayed && (
                      <span>
                        Last played {Math.floor((Date.now() - game.lastPlayed.getTime()) / (1000 * 60 * 60 * 24))} days
                        ago
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {game.isUnlocked ? (
                      <Button className="flex-1" onClick={() => handlePlayGame(game.id)}>
                        <Play className="h-4 w-4 mr-2" />
                        {game.progress > 0 ? "Continue" : "Start Game"}
                      </Button>
                    ) : (
                      <Button variant="outline" className="flex-1 bg-transparent" disabled>
                        <Lock className="h-4 w-4 mr-2" />
                        Locked (Grade {user.grade < 8 ? "8+" : "Required"})
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Subject-specific tabs */}
        {["chemistry", "mathematics", "physics", "biology"].map((subject) => (
          <TabsContent key={subject} value={subject}>
            <div className="grid gap-6 md:grid-cols-2">
              {games
                .filter((game) => game.subject.toLowerCase() === subject)
                .map((game) => (
                  <Card key={game.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-4xl">{game.icon}</div>
                          <div>
                            <CardTitle className="text-xl">{game.name}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">{game.description}</p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-primary">{game.level}</p>
                          <p className="text-xs text-muted-foreground">Current Level</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-secondary">{game.achievements}</p>
                          <p className="text-xs text-muted-foreground">Achievements</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-accent">{game.progress}%</p>
                          <p className="text-xs text-muted-foreground">Complete</p>
                        </div>
                      </div>

                      <Progress value={game.progress} className="h-3" />

                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => handlePlayGame(game.id)}
                        disabled={!game.isUnlocked}
                      >
                        {!game.isUnlocked ? (
                          <>
                            <Lock className="h-4 w-4 mr-2" />
                            Unlock at Grade 8
                          </>
                        ) : game.progress > 0 ? (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Continue Adventure
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Begin Quest
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
