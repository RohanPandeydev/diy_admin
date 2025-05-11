import React, { useMemo } from 'react'
import BlogList from '../component/blog/BlogList'
import Wrapper from '../layouts/Wrapper'
import { Button } from 'reactstrap'
import { NavLink, useParams } from 'react-router-dom'
import SeoList from '../component/seo/SeoList'
import { useState } from 'react'

const Seo = () => {

  const { parentslug, childslug, gslug } = useParams()



  const slugToCall = useMemo(() => {

    return gslug ? gslug : childslug ? childslug : parentslug


  }, [parentslug, childslug, gslug])







  return (
    <Wrapper>
      {/* <NavLink to={"/seo/" + parentslug + "/add"}>
        <Button type='button' className='btn-main'>Add</Button>
      </NavLink> */}
      <SeoList slugToCall={slugToCall} parentslug={parentslug} childslug={childslug} gslug={gslug} />
    </Wrapper>
  )
}

export default Seo