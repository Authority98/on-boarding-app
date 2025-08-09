import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, CheckCircle, Clock, TrendingUp, UserPlus, CheckSquare, Plus } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Track your agency's performance and client onboarding metrics</p>
        </div>
        <Select defaultValue="30">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Clients</p>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-green-600 dark:text-green-400">+3 this 30d</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">33%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Tasks</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Client Success</p>
                <p className="text-2xl font-bold">0%</p>
                <p className="text-xs text-muted-foreground/70">0 completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Task Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Task Type Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Account Creation</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-muted rounded-full">
                  <div className="w-8 h-2 bg-primary rounded-full"></div>
                </div>
                <span className="text-sm font-medium">1</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Document Upload</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-muted rounded-full">
                  <div className="w-8 h-2 bg-primary rounded-full"></div>
                </div>
                <span className="text-sm font-medium">1</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Meeting Scheduling</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full">
                  <div className="w-8 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <span className="text-sm font-medium">1</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm">New Clients</span>
              </div>
              <Badge variant="secondary">3</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <CheckSquare className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm">Tasks Completed</span>
              </div>
              <Badge variant="secondary">1</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                  <Plus className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-sm">New Tasks</span>
              </div>
              <Badge variant="secondary">3</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Client Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">2</div>
              <div className="text-sm text-muted-foreground mb-2">Active Clients</div>
              <div className="w-full h-2 bg-muted rounded-full">
                <div className="w-2/3 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">0</div>
              <div className="text-sm text-muted-foreground mb-2">Completed Onboarding</div>
              <div className="w-full h-2 bg-muted rounded-full">
                <div className="w-0 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">1</div>
              <div className="text-sm text-muted-foreground mb-2">Inactive</div>
              <div className="w-full h-2 bg-muted rounded-full">
                <div className="w-1/3 h-2 bg-orange-600 dark:bg-orange-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
