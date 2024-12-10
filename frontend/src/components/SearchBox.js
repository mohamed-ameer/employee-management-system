import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function SearchBox({ placeholder }) {
    const [keyword, setKeyword] = useState('')
    const navigate = useNavigate()
    const { t } = useTranslation()

    const submitHandler = (e) => {
        e.preventDefault()
        if (keyword.trim()) {
            navigate(`/search/${keyword}`)
        } else {
            navigate('/')
        }
    }

    return (
        <Form onSubmit={submitHandler} className="d-flex">
            <Form.Control
                type="text"
                name="q"
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={placeholder || t('Search...')}
                className="mr-sm-2 ml-sm-5"
            />
            <Button type="submit" variant="outline-light" className="p-2 ms-2">
                <i className="fas fa-search"></i>
            </Button>
        </Form>
    )
}

export default SearchBox
