import React, { useState, useEffect } from 'react'
import { Alert } from 'react-bootstrap'

function Message({ variant = 'info', children, dismissible = true, timeout = 0 }) {
    const [show, setShow] = useState(true)

    useEffect(() => {
        if (timeout > 0) {
            const timer = setTimeout(() => {
                setShow(false)
            }, timeout)
            return () => clearTimeout(timer)
        }
    }, [timeout])

    if (!show) return null

    return (
        <Alert 
            variant={variant} 
            dismissible={dismissible}
            onClose={() => setShow(false)}
            className="animate__animated animate__fadeIn"
        >
            {children}
        </Alert>
    )
}

export default Message
