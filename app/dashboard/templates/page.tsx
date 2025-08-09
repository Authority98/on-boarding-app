import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, MoreHorizontal, FileIcon as FileTemplate, Clock } from "lucide-react"

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Template Management</h1>
          <p className="text-gray-600">Create and manage reusable onboarding workflows</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input placeholder="Search templates..." className="pl-10" />
      </div>

      {/* Template Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileTemplate className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Standard Onboarding</CardTitle>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Active
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">Complete onboarding process for new clients</p>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>2 tasks</span>
              <span>90 min total</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                    1
                  </span>
                  <div>
                    <p className="font-medium text-sm">Welcome Call</p>
                    <p className="text-xs text-gray-600">meeting scheduling</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Required
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                    2
                  </span>
                  <div>
                    <p className="font-medium text-sm">Document Collection</p>
                    <p className="text-xs text-gray-600">document upload</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Required
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="outline" size="sm">
                Edit Tasks
              </Button>
              <span className="text-xs text-gray-500">Updated 7/10/2025</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Quick Setup</CardTitle>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Active
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">Streamlined setup for simple projects</p>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>1 tasks</span>
              <span>45 min total</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                    1
                  </span>
                  <div>
                    <p className="font-medium text-sm">Project Brief</p>
                    <p className="text-xs text-gray-600">form completion</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Required
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="outline" size="sm">
                Edit Tasks
              </Button>
              <span className="text-xs text-gray-500">Updated 7/25/2025</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
