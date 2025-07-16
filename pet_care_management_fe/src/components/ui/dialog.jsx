"use client"

import { createContext, useContext, useEffect, useState } from "react"

const DialogContext = createContext(undefined)

export const Dialog = ({ open = false, onOpenChange, children }) => {
    const [isOpen, setIsOpen] = useState(open)

    useEffect(() => {
        setIsOpen(open)
    }, [open])

    const handleOpenChange = (newOpen) => {
        setIsOpen(newOpen)
        if (onOpenChange) onOpenChange(newOpen)
    }

    return (
        <DialogContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>{children}</DialogContext.Provider>
    )
}

export const DialogContent = ({ className = "", children, ...props }) => {
    const context = useContext(DialogContext)

    if (!context?.open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50" onClick={() => context.onOpenChange(false)} />

            {/* Content */}
            <div className={`relative z-50 w-full max-w-lg mx-4 bg-white rounded-lg shadow-lg ${className}`} {...props}>
                {children}
            </div>
        </div>
    )
}

export const DialogHeader = ({ className = "", children, ...props }) => {
    return (
        <div className={`flex flex-col space-y-1.5 text-center sm:text-left p-6 pb-0 ${className}`} {...props}>
            {children}
        </div>
    )
}

export const DialogTitle = ({ className = "", children, ...props }) => {
    return (
        <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
            {children}
        </h2>
    )
}
