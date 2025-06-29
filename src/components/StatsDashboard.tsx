'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Target,
  Brain,
  Zap,
  DollarSign,
  CheckCircle,
  Clock,
  BarChart3,
  Download
} from 'lucide-react'
import { useTasks, usePowerSystemTodos } from '@/lib/hooks'

interface StatsDashboardProps {
  className?: string
}

interface DailyStats {
  date: string
  tasksCompleted: number
  tasksTotal: number
  completionRate: number
  brainTodos: number
  muscleTodos: number
  moneyTodos: number
  powerSystemTotal: number
}

interface WeeklyStats {
  week: string
  totalTasks: number
  completedTasks: number
  completionRate: number
  powerSystemCompleted: number
  streak: number
}

const COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  brain: '#3b82f6',
  muscle: '#ef4444',
  money: '#10b981'
}

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b']

export function StatsDashboard({ className = '' }: StatsDashboardProps) {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly'>('daily')
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([])
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([])
  const [powerSystemBreakdown, setPowerSystemBreakdown] = useState<any[]>([])
  const [totalStats, setTotalStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    completionRate: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalPowerSystem: 0
  })

  const { data: tasksData } = useTasks()
  
  // Fetch analytics data
  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch(`/api/analytics?timeRange=${timeRange}`)
      if (response.ok) {
        const { data } = await response.json()
        setDailyStats(data.dailyStats || [])
        setWeeklyStats(data.weeklyStats || [])
        setPowerSystemBreakdown(data.powerSystemBreakdown || [])
        setTotalStats(data.totalStats || {
          totalTasks: 0,
          completedTasks: 0,
          completionRate: 0,
          currentStreak: 0,
          longestStreak: 0,
          totalPowerSystem: 0
        })
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      // Fallback to generating mock data
      if (tasksData?.tasks) {
        generateDailyStats()
        generateWeeklyStats()
        generatePowerSystemBreakdown()
        generateTotalStats()
      }
    }
  }

  const generateDailyStats = () => {
    const last14Days = []
    const today = new Date()
    
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
      const dateString = date.toISOString().split('T')[0]
      const dayTasks = tasksData?.tasks?.filter((task: any) => {
        const taskDate = new Date(task.createdAt).toISOString().split('T')[0]
        return taskDate === dateString
      }) || []
      
      const completedTasks = dayTasks.filter((task: any) => task.completed).length
      const totalTasks = dayTasks.length
      
      last14Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        tasksCompleted: completedTasks,
        tasksTotal: totalTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        brainTodos: Math.floor(Math.random() * 5), // Mock data - replace with actual power system data
        muscleTodos: Math.floor(Math.random() * 5),
        moneyTodos: Math.floor(Math.random() * 5),
        powerSystemTotal: Math.floor(Math.random() * 12)
      })
    }
    
    setDailyStats(last14Days)
  }

  const generateWeeklyStats = () => {
    const last8Weeks = []
    const today = new Date()
    
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(today.getTime() - i * 7 * 24 * 60 * 60 * 1000)
      const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
      
      const weekTasks = tasksData?.tasks?.filter((task: any) => {
        const taskDate = new Date(task.createdAt)
        return taskDate >= weekStart && taskDate <= weekEnd
      }) || []
      
      const completedTasks = weekTasks.filter((task: any) => task.completed).length
      const totalTasks = weekTasks.length
      
      last8Weeks.push({
        week: `Week ${8 - i}`,
        totalTasks,
        completedTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        powerSystemCompleted: Math.floor(Math.random() * 50), // Mock data
        streak: Math.floor(Math.random() * 7)
      })
    }
    
    setWeeklyStats(last8Weeks)
  }

  const generatePowerSystemBreakdown = () => {
    // Mock power system data - replace with actual data
    const breakdown = [
      { name: 'Brain', value: 35, color: COLORS.brain },
      { name: 'Muscle', value: 25, color: COLORS.muscle },
      { name: 'Money', value: 20, color: COLORS.money },
      { name: 'Pending', value: 20, color: '#94a3b8' }
    ]
    setPowerSystemBreakdown(breakdown)
  }

  const generateTotalStats = () => {
    const tasks = tasksData?.tasks || []
    const completedTasks = tasks.filter((task: any) => task.completed).length
    const totalTasks = tasks.length
    
    setTotalStats({
      totalTasks,
      completedTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      currentStreak: 7, // Mock data
      longestStreak: 15, // Mock data
      totalPowerSystem: 80 // Mock data
    })
  }

  const exportData = () => {
    const data = timeRange === 'daily' ? dailyStats : weeklyStats
    const dataStr = JSON.stringify(data, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `productivity-stats-${timeRange}-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            📊 Statistics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your productivity patterns and power system progress
          </p>
        </div>
        
        <div className="flex gap-3">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <Button
              variant={timeRange === 'daily' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('daily')}
              className="rounded-md"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Daily
            </Button>
            <Button
              variant={timeRange === 'weekly' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('weekly')}
              className="rounded-md"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Weekly
            </Button>
          </div>
          
          <Button variant="secondary" size="sm" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Tasks
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {totalStats.totalTasks}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+12% from last week</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completion Rate
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {totalStats.completionRate}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+5% improvement</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Current Streak
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {totalStats.currentStreak} days
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Clock className="w-4 h-4 text-gray-500 mr-1" />
            <span className="text-gray-600">Best: {totalStats.longestStreak} days</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Power System
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {totalStats.totalPowerSystem}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+8% this week</span>
          </div>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Completion Trends */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {timeRange === 'daily' ? 'Daily Task Progress' : 'Weekly Task Progress'}
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Completed</span>
              <div className="w-3 h-3 bg-gray-300 rounded-full ml-3"></div>
              <span className="text-sm text-gray-600">Total</span>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timeRange === 'daily' ? dailyStats : weeklyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={timeRange === 'daily' ? 'date' : 'week'} 
                fontSize={12}
              />
              <YAxis fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey={timeRange === 'daily' ? 'tasksTotal' : 'totalTasks'}
                stackId="1"
                stroke={COLORS.primary}
                fill={COLORS.primary}
                fillOpacity={0.3}
                name="Total Tasks"
              />
              <Area
                type="monotone"
                dataKey={timeRange === 'daily' ? 'tasksCompleted' : 'completedTasks'}
                stackId="2"
                stroke={COLORS.success}
                fill={COLORS.success}
                fillOpacity={0.8}
                name="Completed Tasks"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Completion Rate Line Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Completion Rate Trend
            </h3>
            <span className="text-sm text-gray-600">Last {timeRange === 'daily' ? '14 days' : '8 weeks'}</span>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeRange === 'daily' ? dailyStats : weeklyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={timeRange === 'daily' ? 'date' : 'week'} 
                fontSize={12}
              />
              <YAxis fontSize={12} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`${value}%`, 'Completion Rate']}
              />
              <Line
                type="monotone"
                dataKey="completionRate"
                stroke={COLORS.success}
                strokeWidth={3}
                dot={{ fill: COLORS.success, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Power System & Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Power System Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Power System Breakdown
          </h3>
          
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={powerSystemBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {powerSystemBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="mt-4 space-y-2">
            {powerSystemBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Daily Power System Activities */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Power System Activities (Daily)
          </h3>
          
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailyStats.slice(-7)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={10} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="brainTodos" stackId="a" fill={COLORS.brain} name="Brain" />
              <Bar dataKey="muscleTodos" stackId="a" fill={COLORS.muscle} name="Muscle" />
              <Bar dataKey="moneyTodos" stackId="a" fill={COLORS.money} name="Money" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Weekly Progress Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            This Week Summary
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900 dark:text-blue-100">Brain Tasks</span>
              </div>
              <span className="text-lg font-bold text-blue-600">15</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-900 dark:text-red-100">Muscle Tasks</span>
              </div>
              <span className="text-lg font-bold text-red-600">12</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900 dark:text-green-100">Money Tasks</span>
              </div>
              <span className="text-lg font-bold text-green-600">8</span>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-gray-100">Total Progress</span>
                <span className="text-2xl font-bold text-indigo-600">35/40</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: '87.5%' }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">87.5% weekly target achieved</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
