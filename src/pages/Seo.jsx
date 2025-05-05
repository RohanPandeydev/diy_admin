import React from 'react'
import BlogList from '../component/blog/BlogList'
import Wrapper from '../layouts/Wrapper'
import { Button } from 'reactstrap'
import { NavLink, useParams } from 'react-router-dom'
import SeoList from '../component/seo/SeoList'

const Seo = () => {

  const { parentslug } = useParams()







  return (
    <Wrapper>
      {/* <NavLink to={"/seo/" + parentslug + "/add"}>
        <Button type='button' className='btn-main'>Add</Button>
      </NavLink> */}
      <SeoList  parentslug={parentslug}/>
    </Wrapper>
  )
}

export default Seo