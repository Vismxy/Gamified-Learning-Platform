"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  Trophy,
  Medal,
  Award,
  Users,
  Target,
  Zap,
  Clock,
  CheckCircle,
  UserPlus,
  Globe,
  TrendingUp,
  Star,
} from "lucide-react"
import type { LeaderboardEntry } from "@/types/gamification"
import { useTranslation } from "@/lib/i18n"

interface CommunityQuestProps {
  entries: LeaderboardEntry[]
  currentChallenge?: {
    id: string
    title: string
    description: string
    targetScore: number
    currentScore: number
    participants: number
    timeLeft: string
    isJoined?: boolean
    rewards: {
      points: number
      badge?: string
    }
  }
}

export function CommunityQuest({ entries: initialEntries, currentChallenge: initialChallenge }: CommunityQuestProps) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [entries, setEntries] = useState(initialEntries)
  const [currentChallenge, setCurrentChallenge] = useState(initialChallenge)
  const [isJoining, setIsJoining] = useState(false)
  const [userContribution, setUserContribution] = useState(0)
  const [communityStats, setCommunityStats] = useState({
    globalParticipants: 15420,
    activeNow: 892,
    countriesParticipating: 47,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentChallenge && !currentChallenge.isJoined) {
        // Simulate real-time progress updates
        setCurrentChallenge((prev) =>
          prev
            ? {
                ...prev,
                currentScore: Math.min(prev.currentScore + Math.floor(Math.random() * 15) + 5, prev.targetScore),
                participants: prev.participants + Math.floor(Math.random() * 3),
              }
            : prev,
        )

        // Update community stats
        setCommunityStats((prev) => ({
          ...prev,
          activeNow: prev.activeNow + Math.floor(Math.random() * 5) - 2,
          globalParticipants: prev.globalParticipants + Math.floor(Math.random() * 2),
        }))
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [currentChallenge])

  const handleJoinChallenge = async () => {
    if (!currentChallenge) return

    setIsJoining(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setCurrentChallenge((prev) =>
        prev
          ? {
              ...prev,
              isJoined: true,
              participants: prev.participants + 1,
            }
          : prev,
      )

      toast({
        title: "🎉 Welcome to the Challenge!",
        description: `You've joined "${currentChallenge.title}". Complete lessons to help reach the global goal!`,
      })

      setTimeout(() => {
        toast({
          title: "🌟 Participation Bonus!",
          description: "+50 points for joining the community challenge!",
        })
      }, 2000)

      console.log("[v0] User joined challenge:", currentChallenge.id)
    } catch (error) {
      toast({
        title: "Failed to join challenge",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsJoining(false)
    }
  }

  const handleContribute = () => {
    if (!currentChallenge?.isJoined) return

    const contribution = Math.floor(Math.random() * 75) + 25
    const streakBonus = Math.floor(Math.random() * 20) + 5
    const totalContribution = contribution + streakBonus

    setUserContribution((prev) => prev + totalContribution)

    setCurrentChallenge((prev) =>
      prev
        ? {
            ...prev,
            currentScore: Math.min(prev.currentScore + totalContribution, prev.targetScore),
          }
        : prev,
    )

    toast({
      title: `🚀 +${totalContribution} points contributed!`,
      description: `Base: ${contribution} + Streak bonus: ${streakBonus}. Keep the momentum going!`,
    })
  }

  const handleRankUp = (entry: LeaderboardEntry) => {
    if (entry.name === "You") {
      toast({
        title: "🎯 Your Progress",
        description: `Level ${entry.level} • ${entry.points.toLocaleString()} points • Rank #${entry.rank}`,
      })
    } else {
      toast({
        title: `👤 ${entry.name}'s Profile`,
        description: `Level ${entry.level} • ${entry.points.toLocaleString()} points • Inspiring performance!`,
      })
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-4 w-4 text-yellow-500" />
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />
      case 3:
        return <Award className="h-4 w-4 text-orange-500" />
      default:
        return <span className="text-sm font-medium text-muted-foreground">#{rank}</span>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20"
      case 2:
        return "bg-gray-50 border-gray-200 dark:bg-gray-900/20"
      case 3:
        return "bg-orange-50 border-orange-200 dark:bg-orange-900/20"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Globe className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Global Learning Community</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">Students worldwide learning together</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600">
                  {communityStats.globalParticipants.toLocaleString()}
                </div>
                <div className="text-xs text-blue-600">Total Students</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">{communityStats.activeNow}</div>
                <div className="text-xs text-green-600">Active Now</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">{communityStats.countriesParticipating}</div>
                <div className="text-xs text-purple-600">Countries</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Collaborative Challenge */}
      {currentChallenge && (
        <Card
          className={`border-primary/20 transition-all duration-300 ${
            currentChallenge.isJoined
              ? "bg-gradient-to-r from-green-50 to-primary/10 border-green-200 dark:from-green-900/20 dark:to-primary/20"
              : "bg-gradient-to-r from-primary/5 to-secondary/5"
          }`}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              {t("learning.collaborativeChallenge")}
              {currentChallenge.isJoined && (
                <Badge className="bg-green-500 text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Joined
                </Badge>
              )}
              <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{currentChallenge.title}</h3>
                <p className="text-muted-foreground text-sm">{currentChallenge.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-background rounded-lg border">
                  <div className="text-2xl font-bold text-primary">
                    {currentChallenge.currentScore.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">{t("learning.teamScore")}</div>
                </div>
                <div className="text-center p-3 bg-background rounded-lg border">
                  <div className="text-2xl font-bold text-secondary">
                    {currentChallenge.participants.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Participants</div>
                </div>
              </div>

              {currentChallenge.isJoined && userContribution > 0 && (
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
                  <div className="text-lg font-bold text-green-600">{userContribution}</div>
                  <div className="text-xs text-green-600">Your Contribution</div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to Goal</span>
                  <span>{Math.round((currentChallenge.currentScore / currentChallenge.targetScore) * 100)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                    style={{
                      width: `${Math.min((currentChallenge.currentScore / currentChallenge.targetScore) * 100, 100)}%`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Time left: {currentChallenge.timeLeft}
                  </span>
                  <span>Goal: {currentChallenge.targetScore.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                {!currentChallenge.isJoined ? (
                  <Button className="w-full" size="sm" onClick={handleJoinChallenge} disabled={isJoining}>
                    {isJoining ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Joining Challenge...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Join Global Challenge
                      </>
                    )}
                  </Button>
                ) : (
                  <Button className="w-full bg-green-600 hover:bg-green-700" size="sm" onClick={handleContribute}>
                    <Zap className="h-4 w-4 mr-2" />
                    Complete Lesson to Contribute
                  </Button>
                )}

                <div className="text-center p-2 bg-muted/50 rounded-lg">
                  <div className="text-xs text-muted-foreground">
                    Rewards: <span className="font-medium text-primary">{currentChallenge.rewards.points} points</span>
                    {currentChallenge.rewards.badge && (
                      <span className="ml-2">
                        + <span className="font-medium text-secondary">{currentChallenge.rewards.badge} badge</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Global Rankings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {t("learning.communityQuest")}
            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
              Live
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t("learning.globalRanking")} - Compare your progress with students worldwide
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <div
                key={entry.userId}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all hover:shadow-md cursor-pointer ${getRankColor(entry.rank)} ${
                  entry.name === "You" ? "ring-2 ring-primary/20 shadow-md" : ""
                }`}
                onClick={() => handleRankUp(entry)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8">{getRankIcon(entry.rank)}</div>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {entry.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm flex items-center gap-2">
                      {entry.name}
                      {entry.name === "You" && <Badge className="text-xs">You</Badge>}
                      {entry.rank <= 3 && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                    </p>
                    <p className="text-xs text-muted-foreground">Level {entry.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">{entry.points.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{t("learning.points")}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Your current rank</span>
              <span className="font-medium">#{entries.find((e) => e.name === "You")?.rank || "N/A"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
