import React from 'react'
import Wrapper from '../layouts/Wrapper'
import { Button } from 'reactstrap'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import FormQueryList from '../component/form/FormQueryList'


const FormQuery = () => {
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search);
    const queryValue = searchQuery.get("query");


    return (
        <Wrapper>
            <div className="blog-header">
                <div className="admin-heading-header">

                    <h1>Form Queries List</h1>
                </div>

            </div>
            <FormQueryList queryValue={queryValue} />
        </Wrapper>
    )
}

export default FormQuery