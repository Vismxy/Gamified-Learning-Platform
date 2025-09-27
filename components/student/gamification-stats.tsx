"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Flame, Star, Target } from "lucide-react"
import type { StudentProgress } from "@/types/gamification"
import { GamificationService } from "@/lib/gamification"

interface GamificationStatsProps {
  progress: StudentProgress
}

export function GamificationStats({ progress }: GamificationStatsProps) {
  const gamificationService = GamificationService.getInstance()
  const pointsToNext = gamificationService.getPointsToNextLevel(progress.totalPoints)
  const progressToNext = ((200 - pointsToNext) / 200) * 100

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Level and Points */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Level & Points</CardTitle>
          <Star className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">Level {progress.level}</div>
          <p className="text-xs text-muted-foreground">{progress.totalPoints.toLocaleString()} points</p>
          <div className="mt-2">
            <Progress value={progressToNext} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">{pointsToNext} points to next level</p>
          </div>
        </CardContent>
      </Card>

      {/* Learning Streak */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
          <Flame className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-500">{progress.streak.current} days</div>
          <p className="text-xs text-muted-foreground">Best: {progress.streak.longest} days</p>
          <Badge variant="secondary" className="mt-2">
            Keep it up!
          </Badge>
        </CardContent>
      </Card>

      {/* Badges Earned */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Badges</CardTitle>
          <Trophy className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-500">{progress.badges.length}</div>
          <p className="text-xs text-muted-foreground">badges earned</p>
          <div className="flex gap-1 mt-2">
            {progress.badges.slice(0, 3).map((badge) => (
              <div key={badge.id} className="text-lg" title={badge.name}>
                {badge.icon}
              </div>
            ))}
            {progress.badges.length > 3 && (
              <div className="text-xs text-gray-700 dark:text-gray-300 self-center font-medium">
                +{progress.badges.length - 3}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Achievements</CardTitle>
          <Target className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-secondary">{progress.achievements.length}</div>
          <p className="text-xs text-muted-foreground">completed</p>
          <div className="mt-2">
            <p className="text-xs text-muted-foreground">
              Latest: {progress.achievements[progress.achievements.length - 1]?.title || "None yet"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
