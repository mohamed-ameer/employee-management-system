import React from 'react'
import {Link} from 'react-router-dom'
import { useTranslation } from "react-i18next";

function Paginate({ pages, page, keyword = '', isAdmin = false }) {
    const [t,i18n]=useTranslation()
    let category = ''
    if (keyword) {
        category = keyword.split('&category=')[1]
        keyword = keyword.split('?keyword=')[1].split('&')[0]
    }

    return (pages > 1 && (
        <nav className='mt-5' style={i18n.language == 'ar'?{direction:'rtl'}:{direction:'ltr'}}>
            <ul className="pagination justify-content-center">
                {[...Array(pages).keys()].map((x) => (
                    <li className={x + 1 === page?"page-item active":"page-item"} key={x + 1}><Link className="page-link" to={!isAdmin ?`/?keyword=${keyword}&page=${x + 1}&category=${category}`: `/admin/productlist/?keyword=${keyword}&page=${x + 1}&category=${category}`}>{x + 1}</Link></li>
                 ))}
            </ul>
        </nav>
    )
    )
}

export default Paginate
