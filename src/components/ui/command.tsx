import * as React from 'react'

interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`border rounded-md bg-white shadow-sm ${className || ''}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Command.displayName = 'Command'

interface CommandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full border-b px-2 py-1 focus:outline-none focus:ring-0 ${className || ''}`}
        {...props}
      />
    )
  }
)
CommandInput.displayName = 'CommandInput'

interface CommandListProps extends React.HTMLAttributes<HTMLUListElement> {}

export const CommandList = React.forwardRef<HTMLUListElement, CommandListProps>(
  ({ className, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        className={`max-h-48 overflow-y-auto divide-y divide-gray-100 ${className || ''}`}
        {...props}
      />
    )
  }
)
CommandList.displayName = 'CommandList'

interface CommandItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  children: React.ReactNode
}

export const CommandItem = React.forwardRef<HTMLLIElement, CommandItemProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={`px-2 py-1 cursor-pointer hover:bg-gray-100 flex items-center justify-between ${className || ''}`}
        {...props}
      >
        {children}
      </li>
    )
  }
)
CommandItem.displayName = 'CommandItem'
