"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Bell, X, Check, Trash2, MessageSquare, Calendar, User, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  type: 'message' | 'task' | 'client' | 'system'
  title: string
  description: string
  time: string
  read: boolean
  avatar?: string
  initials?: string
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'system',
    title: 'Welcome to our platform!',
    description: 'Thank you for joining us. Start by adding your first client to begin the onboarding process.',
    time: 'Just now',
    read: false,
    initials: 'WE'
  }
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'message':
      return <MessageSquare className="w-4 h-4 text-blue-500" />
    case 'task':
      return <Calendar className="w-4 h-4 text-orange-500" />
    case 'client':
      return <User className="w-4 h-4 text-green-500" />
    case 'system':
      return <AlertCircle className="w-4 h-4 text-purple-500" />
    default:
      return <Bell className="w-4 h-4 text-gray-500" />
  }
}

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-7 h-7" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs font-medium animate-pulse"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-popover border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between p-3 border-b">
            <h3 className="text-base font-semibold">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-xs h-6 px-2"
              >
                Mark all read
              </Button>
            )}
          </div>
          
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={cn(
                  "p-3 cursor-pointer hover:bg-muted/50 border-b last:border-b-0",
                  !notification.read && "bg-blue-50/50 dark:bg-blue-950/20"
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="flex-shrink-0 mt-1">
                    {notification.initials ? (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {notification.initials}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <p className={cn(
                        "text-sm font-medium truncate",
                        !notification.read ? 'text-foreground' : 'text-muted-foreground'
                      )}>
                        {notification.title}
                      </p>
                      <div className="flex items-center gap-1 ml-2">
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-4 h-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeNotification(notification.id)
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {notification.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {notifications.length > 0 && (
            <div className="border-t p-2">
              <Button variant="ghost" size="sm" className="w-full text-xs">
                View all notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}