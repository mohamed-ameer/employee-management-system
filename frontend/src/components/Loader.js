import React from 'react'
import { Spinner } from 'react-bootstrap'

function Loader({ size = 100 }) {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
            <Spinner
                animation="border"
                role="status"
                style={{
                    width: size,
                    height: size,
                    margin: 'auto',
                    display: 'block'
                }}
            >
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    )
}

export default Loader
