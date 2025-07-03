import React, { useEffect, useMemo, useState } from 'react'
import Wrapper from '../layouts/Wrapper'
import { Button, Col, Row } from 'reactstrap'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import BlogDetail from '../component/blog/BlogDetail'
import SeoDetail from '../component/seo/SeoDetail'
import { ProtectedMethod } from '../guard/RBACGuard'
const SeoDetails = () => {
  const { parentslug, childslug, gslug } = useParams()
  const [decodeSlug, setDecodeSlug] = useState(false)
  const navigate = useNavigate()









  const slugToCall = useMemo(() => {

    return gslug ? gslug : childslug ? childslug : parentslug


  }, [parentslug, childslug, gslug])




  return (
    <Wrapper>
      <div className='seo-header-container'>
          <ProtectedMethod moduleName={"seo"} action='update'>

            <h6>SEO</h6>
            <NavLink to={`/seo${parentslug ? `/${parentslug}` : ""}${childslug ? `/${childslug}` : ""}${gslug ? `/${gslug}` : ""}/update`}>
              <Button color="primary" className='back-button me-2'>Edit</Button>
            </NavLink>
          </ProtectedMethod>



      </div>
      <SeoDetail slugToCall={slugToCall} parentslug={parentslug} childslug={childslug} gslug={gslug} />






    </Wrapper>
  )
}

export default SeoDetails