import React, { useEffect, useMemo, useState } from 'react'
import Wrapper from '../layouts/Wrapper'
import { Button, Col, Row } from 'reactstrap'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import BlogDetail from '../component/blog/BlogDetail'
import SeoDetail from '../component/seo/SeoDetail'
const SeoDetails = () => {
  const { parentslug, childslug, gslug } = useParams()
  const [decodeSlug, setDecodeSlug] = useState(false)
  const navigate = useNavigate()









  const slugToCall = useMemo(() => {

    return gslug ? gslug : childslug ? childslug : parentslug


  }, [parentslug, childslug, gslug])




  return (
    <Wrapper>
      <Row>
        <Col md={2}>
          <NavLink to={`/seo${parentslug ? `/${parentslug}` : ""}${childslug ? `/${childslug}` : ""}${gslug ? `/${gslug}` : ""}/update`}>
            <Button color="primary" size="sm">Edit</Button>
          </NavLink>
        </Col>



      </Row>
      <SeoDetail slugToCall={slugToCall} parentslug={parentslug} childslug={childslug} gslug={gslug} />






    </Wrapper>
  )
}

export default SeoDetails