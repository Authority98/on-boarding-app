import { DashboardConfig } from './supabase'

/**
 * Enhanced widget visibility utility for dashboard management
 * Handles all widget visibility logic consistently across preview and live dashboards
 */

/**
 * Check if a widget is visible based on dashboard configuration
 * @param dashboardConfig - The dashboard configuration object
 * @param path - Widget path (e.g., 'kpiCards', 'quickActions.viewMessages')
 * @param index - Optional index for array-based widgets (e.g., KPI cards)
 * @returns boolean indicating if the widget should be visible
 */
export function getWidgetVisibility(
  dashboardConfig: DashboardConfig, 
  path: string, 
  index?: number
): boolean {
  if (!dashboardConfig?.layout?.widgetVisibility) {
    return true // Default to visible if no configuration exists
  }

  const pathParts = path.split('.')
  let current = dashboardConfig.layout.widgetVisibility as any
  
  // Navigate through the path
  for (const part of pathParts) {
    if (current[part] === undefined) {
      return true // Default to visible if path doesn't exist
    }
    current = current[part]
  }
  
  // Handle array-based visibility (like KPI cards)
  if (index !== undefined && Array.isArray(current)) {
    return current[index] !== false
  }
  
  // Handle boolean values
  return current !== false
}

/**
 * Update widget visibility in dashboard configuration
 * @param dashboardConfig - Current dashboard configuration
 * @param path - Widget path to update
 * @param visible - New visibility state
 * @param index - Optional index for array-based widgets
 * @returns Updated dashboard configuration
 */
export function updateWidgetVisibility(
  dashboardConfig: DashboardConfig,
  path: string,
  visible: boolean,
  index?: number
): DashboardConfig {
  const newConfig = { ...dashboardConfig }
  
  // Ensure layout and widgetVisibility exist
  if (!newConfig.layout) newConfig.layout = {}
  if (!newConfig.layout.widgetVisibility) newConfig.layout.widgetVisibility = {}
  
  const pathParts = path.split('.')
  let current = newConfig.layout.widgetVisibility as any
  
  // Navigate to the correct nested object, creating path if needed
  for (let i = 0; i < pathParts.length - 1; i++) {
    const part = pathParts[i]
    if (!current[part]) {
      current[part] = {}
    }
    current = current[part]
  }
  
  const finalKey = pathParts[pathParts.length - 1]
  
  // Handle array updates (like kpiCards)
  if (index !== undefined) {
    if (!Array.isArray(current[finalKey])) {
      current[finalKey] = []
    }
    current[finalKey][index] = visible
  } else {
    current[finalKey] = visible
  }
  
  return newConfig
}

/**
 * Get all widget paths for a specific view mode
 * @param viewMode - The dashboard view mode
 * @returns Array of widget paths for that mode
 */
export function getWidgetPathsForMode(viewMode: string): string[] {
  const commonPaths = [
    'kpiCards',
    'chartSections.performanceChart',
    'chartSections.performanceTrends',
    'activityFeed',
    'quickActions',
    'quickActions.viewMessages',
    'quickActions.downloadReports', 
    'quickActions.scheduleMeeting',
    'quickActions.addKPI',
    'quickActions.contactSupport',
    'quickActions.downloadResources',
    'quickActions.viewTasks'
  ]
  
  const taskModePaths = [
    'progressOverview',
    'taskList',
    'helpSection',
    'taskStats.totalTasks',
    'taskStats.completedTasks',
    'taskStats.inProgressTasks'
  ]
  
  switch (viewMode) {
    case 'dashboard':
      return commonPaths
    case 'task':
      return [...commonPaths, ...taskModePaths]
    case 'hybrid':
      return [...commonPaths, ...taskModePaths]
    default:
      return commonPaths
  }
}