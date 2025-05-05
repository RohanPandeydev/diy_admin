import React from 'react'
import BlogForm from '../component/blog/BlogForm'
import Wrapper from '../layouts/Wrapper'

const AddBlog = () => {
    return (
        <Wrapper>
            <BlogForm  title={"Add Blog"}/>

        </Wrapper>
    )
}

export default AddBlog