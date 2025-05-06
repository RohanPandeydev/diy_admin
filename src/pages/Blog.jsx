import React from 'react'
import BlogList from '../component/blog/BlogList'
import Wrapper from '../layouts/Wrapper'
import { Button } from 'reactstrap'
import { NavLink } from 'react-router-dom'


const Blog = () => {



    





    return (
        <Wrapper>
            <NavLink to={"/cms/blog/add"}>
                <Button type='button' className='btn-main'>Add</Button>
            </NavLink>
            <BlogList />
        </Wrapper>
    )
}

export default Blog