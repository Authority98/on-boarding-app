"use client"

import React from 'react'

export interface InlineEditorProps {
  value: string
  onChange: (value: string) => void
  elementId: string
  className?: string
  multiline?: boolean
  placeholder?: string
  isEditing: (id: string) => boolean
  startEditing: (id: string) => void
  stopEditing: () => void
}

export interface InlineColorPickerProps {
  value: string
  onChange: (value: string) => void
  elementId: string
  className?: string
  isEditing: (id: string) => boolean
  startEditing: (id: string) => void
  stopEditing: () => void
}

// Inline text editor component
export const InlineEditor: React.FC<InlineEditorProps> = ({
  value,
  onChange,
  elementId,
  className = "",
  multiline = false,
  placeholder = "",
  isEditing,
  startEditing,
  stopEditing
}) => {
  if (isEditing(elementId)) {
    return multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={stopEditing}
        onKeyDown={(e) => {
          if (e.key === 'Escape') stopEditing()
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            stopEditing()
          }
        }}
        className={`bg-white border-2 border-blue-500 rounded px-2 py-1 outline-none resize-none ${className}`}
        placeholder={placeholder}
        autoFocus
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={stopEditing}
        onKeyDown={(e) => {
          if (e.key === 'Escape') stopEditing()
          if (e.key === 'Enter') stopEditing()
        }}
        className={`bg-white border-2 border-blue-500 rounded px-2 py-1 outline-none ${className}`}
        placeholder={placeholder}
        autoFocus
      />
    )
  }

  return (
    <div
      onClick={() => startEditing(elementId)}
      className={`cursor-pointer hover:bg-blue-50 hover:border hover:border-blue-200 rounded px-1 transition-all duration-200 ${className} ${value ? '' : 'text-gray-400'}`}
      title="Click to edit"
    >
      {value || placeholder}
    </div>
  )
}

// Color picker inline editor component
export const InlineColorPicker: React.FC<InlineColorPickerProps> = ({ 
  value, 
  onChange, 
  elementId, 
  className = "",
  isEditing,
  startEditing,
  stopEditing
}) => {
  if (isEditing(elementId)) {
    return (
      <div className="flex items-center gap-2 bg-white border-2 border-blue-500 rounded p-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded border cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={stopEditing}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter') stopEditing()
          }}
          className="px-2 py-1 border rounded text-sm font-mono"
          autoFocus
        />
      </div>
    )
  }

  return (
    <div
      onClick={() => startEditing(elementId)}
      className={`cursor-pointer hover:ring-2 hover:ring-blue-200 rounded p-1 transition-all duration-200 ${className}`}
      title="Click to edit color"
    >
      <div 
        className="w-6 h-6 rounded border-2 border-white shadow-sm"
        style={{ backgroundColor: value }}
      />
    </div>
  )
}