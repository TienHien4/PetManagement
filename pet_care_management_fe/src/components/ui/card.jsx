import React from "react"

export const Card = React.forwardRef(({ className = "", children, ...props }, ref) => {
    const classes = `rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm ${className}`

    return (
        <div className={classes} ref={ref} {...props}>
            {children}
        </div>
    )
})

Card.displayName = "Card"

export const CardContent = React.forwardRef(({ className = "", children, ...props }, ref) => {
    const classes = `p-6 pt-0 ${className}`

    return (
        <div className={classes} ref={ref} {...props}>
            {children}
        </div>
    )
})

CardContent.displayName = "CardContent"
