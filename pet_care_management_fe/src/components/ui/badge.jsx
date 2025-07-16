import React from "react"

export const Badge = React.forwardRef(({ className = "", variant = "default", children, ...props }, ref) => {
    const baseClasses =
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"

    const variants = {
        default: "border-transparent bg-blue-600 text-white hover:bg-blue-700",
        secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
        destructive: "border-transparent bg-red-500 text-white hover:bg-red-600",
        outline: "text-gray-950 border-gray-200",
    }

    const classes = `${baseClasses} ${variants[variant]} ${className}`

    return (
        <div className={classes} ref={ref} {...props}>
            {children}
        </div>
    )
})

Badge.displayName = "Badge"
