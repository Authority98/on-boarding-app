"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"
import { 
  MessageSquare, 
  Send, 
  X, 
  Minimize2, 
  Maximize2,
  Users,
  Clock,
  Check,
  CheckCheck
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface ChatMessage {
  id: string
  chat_room_id: string
  sender_type: 'agency' | 'client'
  sender_id: string
  sender_name: string
  message_text: string
  message_type: 'text' | 'file' | 'image'
  is_read: boolean
  created_at: string
  updated_at: string
}

interface ChatRoom {
  id: string
  client_id: string
  agency_user_id: string
  title: string
  status: 'active' | 'archived' | 'closed'
  last_message_at: string
  created_at: string
  updated_at: string
}

interface GuestUserInfo {
  name: string
  email: string
}

interface ChatWidgetProps {
  clientId: string
  clientName: string
  // Position for where the chat widget should appear
  position?: 'bottom-right' | 'sidebar' | 'inline'
  // Whether the chat is for a client (no auth) or agency user (authenticated)
  userType?: 'client' | 'agency'
  className?: string
  isGuestMode?: boolean
}

export function ChatWidget({ 
  clientId, 
  clientName, 
  position = 'bottom-right',
  userType = 'client',
  className,
  isGuestMode = false
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [showGuestForm, setShowGuestForm] = useState(isGuestMode)
  const [guestInfo, setGuestInfo] = useState<GuestUserInfo>({ name: '', email: '' })
  const [guestFormData, setGuestFormData] = useState({ name: '', email: '' })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize chat room and load messages
  useEffect(() => {
    if (clientId) {
      initializeChat()
    }
  }, [clientId])

  // Set up real-time subscriptions
  useEffect(() => {
    if (!chatRoom) return

    const channel = supabase
      .channel(`chat_room_${chatRoom.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_room_id=eq.${chatRoom.id}`
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage
          setMessages(prev => {
            // Check if message already exists to prevent duplicates
            const exists = prev.some(msg => msg.id === newMessage.id)
            if (exists) return prev
            return [...prev, newMessage]
          })
          
          // Update unread count if chat is not open and message is from agency
          if (!isOpen && newMessage.sender_type === 'agency') {
            setUnreadCount(prev => prev + 1)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [chatRoom, isOpen])

  const initializeChat = async () => {
    try {
      setIsLoading(true)
      
      // First, try to find existing chat room
      let { data: existingRoom, error: roomError } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('client_id', clientId)
        .eq('status', 'active')
        .single()

      if (roomError && roomError.code !== 'PGRST116') {
        console.error('Error fetching chat room:', roomError)
        return
      }

      // If no room exists, create one
      if (!existingRoom) {
        const { data: newRoom, error: createError } = await supabase
          .from('chat_rooms')
          .insert([
            {
              client_id: clientId,
              title: `Chat with ${clientName}`,
              status: 'active'
            }
          ])
          .select()
          .single()

        if (createError) {
          console.error('Error creating chat room:', createError)
          toast.error('Failed to create chat room')
          return
        }

        existingRoom = newRoom
      }

      if (existingRoom) {
        setChatRoom(existingRoom)
        await loadMessages(existingRoom.id)
      }
    } catch (error) {
      console.error('Error initializing chat:', error)
      toast.error('Failed to initialize chat')
    } finally {
      setIsLoading(false)
    }
  }

  const loadMessages = async (roomId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(50) // Load last 50 messages

      if (error) throw error
      
      setMessages(data || [])
      
      // Count unread messages from agency
      const unreadMessages = data?.filter(msg => 
        !msg.is_read && 
        msg.sender_type === 'agency' && 
        userType === 'client'
      ).length || 0
      
      setUnreadCount(unreadMessages)
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatRoom) return

    try {
      setIsLoading(true)
      
      const senderName = isGuestMode && guestInfo.name 
        ? guestInfo.name 
        : (userType === 'client' ? clientName : 'Support Team')
      
      const messageData = {
        chat_room_id: chatRoom.id,
        sender_type: userType,
        sender_id: userType === 'client' ? clientId : null, // Will be set by agency auth
        sender_name: senderName,
        message_text: newMessage.trim(),
        message_type: 'text' as const
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .insert([messageData])
        .select()
        .single()

      if (error) throw error

      // Immediately add the message to local state for better UX
      if (data) {
        setMessages(prev => [...prev, data])
      }

      setNewMessage("")
      
      // Message will also be received via real-time subscription (but we handle duplicates)
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleGuestFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!guestFormData.name.trim() || !guestFormData.email.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(guestFormData.email)) {
      toast.error('Please enter a valid email address')
      return
    }
    
    setGuestInfo(guestFormData)
    setShowGuestForm(false)
    setIsOpen(true)
    
    // Initialize chat after guest info is collected
    if (clientId) {
      initializeChat()
    }
  }

  const toggleChat = () => {
    if (isGuestMode && !guestInfo.name) {
      setShowGuestForm(true)
      return
    }
    
    setIsOpen(!isOpen)
    if (!isOpen) {
      // Mark messages as read when opening chat
      setUnreadCount(0)
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
  }

  // Render different layouts based on position
  if (position === 'bottom-right') {
    return (
      <div className={cn("fixed bottom-4 right-4 z-50", className)}>
        {/* Chat toggle button */}
        {!isOpen && !showGuestForm && (
          <Button
            onClick={toggleChat}
            className="relative h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            size="icon"
          >
            <MessageSquare className="w-6 h-6" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        )}

        {/* Guest contact form */}
        {showGuestForm && (
          <Card className="w-80 shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  <CardTitle className="text-lg">Start Chat</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setShowGuestForm(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Please provide your contact information to start chatting with our support team.
              </div>
              <form onSubmit={handleGuestFormSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Your name"
                    value={guestFormData.name}
                    onChange={(e) => setGuestFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={guestFormData.email}
                    onChange={(e) => setGuestFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Starting Chat...' : 'Start Chat'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Chat window */}
        {isOpen && (
          <Card className="w-80 h-96 shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  <CardTitle className="text-lg">Support Chat</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setIsMinimized(!isMinimized)}
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {!isMinimized && (
              <CardContent className="p-0 flex flex-col h-80">
                {/* Messages area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {isLoading && messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Loading chat...</p>
                      </div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Start a conversation</p>
                        <p className="text-xs mt-1">Send a message to get help</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-2",
                          message.sender_type === userType ? "justify-end" : "justify-start"
                        )}
                      >
                        {message.sender_type !== userType && (
                          <Avatar className="w-6 h-6 mt-1">
                            <AvatarFallback className="text-xs">
                              {getInitials(message.sender_name)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={cn(
                          "max-w-[70%] space-y-1",
                          message.sender_type === userType ? "items-end" : "items-start"
                        )}>
                          <div className={cn(
                            "rounded-lg px-3 py-2 text-sm",
                            message.sender_type === userType
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}>
                            {message.message_text}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(message.created_at)}</span>
                            {message.sender_type === userType && (
                              <span className="ml-1">
                                {message.is_read ? (
                                  <CheckCheck className="w-3 h-3 text-blue-500" />
                                ) : (
                                  <Check className="w-3 h-3" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <div className="border-t p-3">
                  {chatRoom ? (
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        disabled={isLoading}
                        className="flex-1"
                      />
                      <Button 
                        onClick={sendMessage} 
                        disabled={isLoading || !newMessage.trim()}
                        size="icon"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center text-sm text-muted-foreground">
                      Chat not available
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        )}
      </div>
    )
  }

  // Inline/sidebar layout for integration into dashboard modes
  return (
    <Card className={cn("h-96", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <CardTitle className="text-lg">Support Chat</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 px-2 text-xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex flex-col h-80">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading && messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Loading chat...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Start a conversation</p>
                <p className="text-xs mt-1">Send a message to get help</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2",
                  message.sender_type === userType ? "justify-end" : "justify-start"
                )}
              >
                {message.sender_type !== userType && (
                  <Avatar className="w-6 h-6 mt-1">
                    <AvatarFallback className="text-xs">
                      {getInitials(message.sender_name)}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={cn(
                  "max-w-[70%] space-y-1",
                  message.sender_type === userType ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "rounded-lg px-3 py-2 text-sm",
                    message.sender_type === userType
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}>
                    {message.message_text}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(message.created_at)}</span>
                    {message.sender_type === userType && (
                      <span className="ml-1">
                        {message.is_read ? (
                          <CheckCheck className="w-3 h-3 text-blue-500" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        <div className="border-t p-3">
          {chatRoom ? (
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={sendMessage} 
                disabled={isLoading || !newMessage.trim()}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              Chat not available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}