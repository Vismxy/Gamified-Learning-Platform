"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Award, Crown, Star, Users, Clock, Target } from "lucide-react"
import type { User } from "@/types/user"

interface LeaderboardEntry {
  id: string
  name: string
  school: string
  grade: number
  totalPoints: number
  weeklyPoints: number
  gamesPlayed: number
  achievements: number
  avatar: string
  rank: number
  previousRank?: number
  streak: number
  lastActive: Date
}

interface CommunityQuest {
  id: string
  title: string
  description: string
  targetPoints: number
  currentPoints: number
  participants: number
  timeLeft: string
  rewards: {
    points: number
    badge: string
    certificate?: string
  }
  isActive: boolean
  endDate: Date
}

interface WeeklyLeaderboardProps {
  currentUser: User
}

export function WeeklyLeaderboard({ currentUser }: WeeklyLeaderboardProps) {
  const [selectedTab, setSelectedTab] = useState("weekly")
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [communityQuest, setCommunityQuest] = useState<CommunityQuest | null>(null)

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        id: "1",
        name: "Priya Sharma",
        school: "Delhi Public School",
        grade: 9,
        totalPoints: 2850,
        weeklyPoints: 1200,
        gamesPlayed: 15,
        achievements: 12,
        avatar: "👩‍🎓",
        rank: 1,
        previousRank: 3,
        streak: 7,
        lastActive: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
      {
        id: "2",
        name: "Arjun Patel",
        school: "Kendriya Vidyalaya",
        grade: 8,
        totalPoints: 2720,
        weeklyPoints: 1150,
        gamesPlayed: 18,
        achievements: 10,
        avatar: "👨‍🎓",
        rank: 2,
        previousRank: 1,
        streak: 5,
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
      {
        id: "3",
        name: "Sneha Reddy",
        school: "Narayana School",
        grade: 10,
        totalPoints: 2680,
        weeklyPoints: 1100,
        gamesPlayed: 12,
        achievements: 15,
        avatar: "👩‍🔬",
        rank: 3,
        previousRank: 2,
        streak: 4,
        lastActive: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      },
      {
        id: currentUser.id,
        name: currentUser.name || "You",
        school: currentUser.school || "Your School",
        grade: currentUser.grade || 8,
        totalPoints: 1850,
        weeklyPoints: 650,
        gamesPlayed: 8,
        achievements: 6,
        avatar: "🧑‍💻",
        rank: 12,
        previousRank: 15,
        streak: 3,
        lastActive: new Date(),
      },
      // Add more mock entries
      ...Array.from({ length: 20 }, (_, i) => ({
        id: `user-${i + 5}`,
        name: `Student ${i + 5}`,
        school: `School ${i + 1}`,
        grade: Math.floor(Math.random() * 5) + 6,
        totalPoints: Math.floor(Math.random() * 2000) + 500,
        weeklyPoints: Math.floor(Math.random() * 800) + 100,
        gamesPlayed: Math.floor(Math.random() * 20) + 1,
        achievements: Math.floor(Math.random() * 10) + 1,
        avatar: ["👨‍🎓", "👩‍🎓", "🧑‍🔬", "👨‍🔬", "👩‍🔬"][Math.floor(Math.random() * 5)],
        rank: i + 5,
        previousRank: i + Math.floor(Math.random() * 10) + 1,
        streak: Math.floor(Math.random() * 10),
        lastActive: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24), // Random within last day
      })),
    ].sort((a, b) => b.weeklyPoints - a.weeklyPoints)

    // Update ranks based on sorting
    mockLeaderboard.forEach((entry, index) => {
      entry.rank = index + 1
    })

    setLeaderboardData(mockLeaderboard)

    // Mock community quest
    setCommunityQuest({
      id: "stem-mastery-week",
      title: "STEM Mastery Week",
      description: "Join students across India to complete 10,000 STEM challenges this week!",
      targetPoints: 100000,
      currentPoints: 72500,
      participants: 1247,
      timeLeft: "2 days 14 hours",
      rewards: {
        points: 500,
        badge: "STEM Champion",
        certificate: "Digital Certificate of Excellence",
      },
      isActive: true,
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000),
    })
  }, [currentUser])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getRankChange = (current: number, previous?: number) => {
    if (!previous) return null
    const change = previous - current
    if (change > 0) {
      return <span className="text-green-600 text-xs">↗ +{change}</span>
    } else if (change < 0) {
      return <span className="text-red-600 text-xs">↘ {change}</span>
    }
    return <span className="text-gray-500 text-xs">—</span>
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  const currentUserEntry = leaderboardData.find((entry) => entry.id === currentUser.id)
  const topThree = leaderboardData.slice(0, 3)
  const questProgress = communityQuest ? (communityQuest.currentPoints / communityQuest.targetPoints) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Community Quest Mode */}
      {communityQuest && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-purple-800">Community Quest Mode</CardTitle>
                  <p className="text-sm text-purple-600">{communityQuest.description}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                <Clock className="h-3 w-3 mr-1" />
                {communityQuest.timeLeft}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Community Progress</span>
                <span>
                  {communityQuest.currentPoints.toLocaleString()} / {communityQuest.targetPoints.toLocaleString()}{" "}
                  points
                </span>
              </div>
              <Progress value={questProgress} className="h-3" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <p className="font-bold text-lg text-purple-600">{communityQuest.participants}</p>
                <p className="text-muted-foreground">Participants</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg text-purple-600">{Math.round(questProgress)}%</p>
                <p className="text-muted-foreground">Complete</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg text-purple-600">+{communityQuest.rewards.points}</p>
                <p className="text-muted-foreground">Bonus Points</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg text-purple-600">{communityQuest.rewards.badge}</p>
                <p className="text-muted-foreground">Badge Reward</p>
              </div>
            </div>

            {/* Weekly Rewards Section for Top 3 Students */}
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Weekly Top 3 Rewards
              </h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-lg">
                  <Crown className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                  <p className="font-bold text-yellow-800">1st Place</p>
                  <p className="text-xs text-yellow-700 mt-1">Premium Science Kit</p>
                  <p className="text-xs text-yellow-700">+ Digital Certificate</p>
                  <p className="text-xs text-yellow-700">+ 1000 bonus points</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg">
                  <Medal className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                  <p className="font-bold text-gray-800">2nd Place</p>
                  <p className="text-xs text-gray-700 mt-1">STEM Books Bundle</p>
                  <p className="text-xs text-gray-700">+ Achievement Badge</p>
                  <p className="text-xs text-gray-700">+ 750 bonus points</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-b from-amber-100 to-amber-200 rounded-lg">
                  <Award className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                  <p className="font-bold text-amber-800">3rd Place</p>
                  <p className="text-xs text-amber-700 mt-1">Stationery Set</p>
                  <p className="text-xs text-amber-700">+ Learning Resources</p>
                  <p className="text-xs text-amber-700">+ 500 bonus points</p>
                </div>
              </div>
              <div className="mt-3 text-center">
                <p className="text-xs text-muted-foreground">
                  Rewards distributed every Sunday at midnight. Keep climbing the leaderboard!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Your Rank Card */}
      {currentUserEntry && (
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{currentUserEntry.avatar}</div>
                <div>
                  <h3 className="font-bold text-lg">Your Rank: #{currentUserEntry.rank}</h3>
                  <p className="text-sm text-muted-foreground">{currentUserEntry.weeklyPoints} points this week</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getRankChange(currentUserEntry.rank, currentUserEntry.previousRank)}
                    <Badge variant="outline" className="text-xs">
                      {currentUserEntry.streak} day streak
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-bold">{currentUserEntry.totalPoints}</span>
                </div>
                <p className="text-xs text-muted-foreground">{currentUserEntry.achievements} achievements</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly">
            <Trophy className="h-4 w-4 mr-2" />
            Weekly
          </TabsTrigger>
          <TabsTrigger value="all-time">
            <Crown className="h-4 w-4 mr-2" />
            All Time
          </TabsTrigger>
          <TabsTrigger value="school">
            <Users className="h-4 w-4 mr-2" />
            My School
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weekly">
          <div className="space-y-4">
            {/* Top 3 Podium */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Top Performers This Week
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Top 3 students will receive exclusive rewards this Sunday!
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {topThree.map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`text-center p-4 rounded-lg relative overflow-hidden ${
                        index === 0
                          ? "bg-gradient-to-b from-yellow-50 to-yellow-100 border-2 border-yellow-200"
                          : index === 1
                            ? "bg-gradient-to-b from-gray-50 to-gray-100 border-2 border-gray-200"
                            : "bg-gradient-to-b from-amber-50 to-amber-100 border-2 border-amber-200"
                      }`}
                    >
                      {/* Reward Indicator for Top 3 */}
                      {index === 0 && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-yellow-500 text-white text-xs">🎁 Science Kit</Badge>
                        </div>
                      )}
                      {index === 1 && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-gray-500 text-white text-xs">📚 Books</Badge>
                        </div>
                      )}
                      {index === 2 && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-amber-500 text-white text-xs">✏️ Stationery</Badge>
                        </div>
                      )}

                      <div className="text-4xl mb-2">{entry.avatar}</div>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {getRankIcon(entry.rank)}
                        <span className="font-bold">{entry.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{entry.school}</p>
                      <p className="text-sm text-muted-foreground mb-2">Grade {entry.grade}</p>
                      <div className="space-y-1">
                        <p className="font-bold text-lg text-primary">{entry.weeklyPoints} pts</p>
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                          <span>{entry.gamesPlayed} games</span>
                          <span>•</span>
                          <span>{entry.achievements} achievements</span>
                        </div>
                        {getRankChange(entry.rank, entry.previousRank) && (
                          <div className="flex justify-center">{getRankChange(entry.rank, entry.previousRank)}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Full Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Leaderboard</CardTitle>
                <p className="text-sm text-muted-foreground">Rankings based on points earned this week</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaderboardData.slice(0, 20).map((entry) => (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        entry.id === currentUser.id ? "bg-primary/5 border-primary/20" : "bg-muted/50 hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 flex justify-center">{getRankIcon(entry.rank)}</div>
                        <div className="text-2xl">{entry.avatar}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{entry.name}</span>
                            {entry.id === currentUser.id && (
                              <Badge variant="secondary" className="text-xs">
                                You
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{entry.school}</span>
                            <span>•</span>
                            <span>Grade {entry.grade}</span>
                            <span>•</span>
                            <span>{formatTimeAgo(entry.lastActive)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-primary">{entry.weeklyPoints}</span>
                          <span className="text-sm text-muted-foreground">pts</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{entry.gamesPlayed} games</span>
                          {getRankChange(entry.rank, entry.previousRank)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {leaderboardData.length > 20 && (
                  <div className="text-center mt-4">
                    <Button variant="outline">Load More</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="all-time">
          <Card>
            <CardHeader>
              <CardTitle>All-Time Champions</CardTitle>
              <p className="text-sm text-muted-foreground">Top performers based on total points earned</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboardData
                  .sort((a, b) => b.totalPoints - a.totalPoints)
                  .slice(0, 10)
                  .map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        entry.id === currentUser.id ? "bg-primary/5 border-primary/20" : "bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 flex justify-center">{getRankIcon(index + 1)}</div>
                        <div className="text-2xl">{entry.avatar}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{entry.name}</span>
                            {entry.id === currentUser.id && (
                              <Badge variant="secondary" className="text-xs">
                                You
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{entry.school}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-primary">{entry.totalPoints} pts</span>
                        <p className="text-xs text-muted-foreground">{entry.achievements} achievements</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="school">
          <Card>
            <CardHeader>
              <CardTitle>School Leaderboard</CardTitle>
              <p className="text-sm text-muted-foreground">
                Top students from {currentUserEntry?.school || "your school"}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboardData
                  .filter((entry) => entry.school === currentUserEntry?.school)
                  .slice(0, 10)
                  .map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        entry.id === currentUser.id ? "bg-primary/5 border-primary/20" : "bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 flex justify-center">{getRankIcon(index + 1)}</div>
                        <div className="text-2xl">{entry.avatar}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{entry.name}</span>
                            {entry.id === currentUser.id && (
                              <Badge variant="secondary" className="text-xs">
                                You
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">Grade {entry.grade}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-primary">{entry.weeklyPoints} pts</span>
                        <p className="text-xs text-muted-foreground">this week</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
