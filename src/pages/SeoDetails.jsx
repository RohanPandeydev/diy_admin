import React, { useEffect, useState } from 'react'
import Wrapper from '../layouts/Wrapper'
import { Button, Col, Row } from 'reactstrap'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import BlogDetail from '../component/blog/BlogDetail'
import SeoDetail from '../component/seo/SeoDetail'
const SeoDetails = () => {
  const { slug, parentslug } = useParams()
  const [decodeSlug, setDecodeSlug] = useState(false)
  const navigate = useNavigate()









  useEffect(() => {
    try {
      const decodeSlug = slug && atob(slug);
      console.log("decodeSlug", !!slug, slug);

      slug && setDecodeSlug(() => decodeSlug || "");
    } catch (error) {
      // console.error("Error decoding user ID:", error.message);
      // Handle the error gracefully, e.g., display an error message to the user
      navigate(-1)
    }
  }, [slug]);

  return (
    <Wrapper>
      <Row>
        <Col md={2}>
          <NavLink to={`/seo/${parentslug}/update/${btoa(decodeSlug)}`}>
            <Button color="primary" size="sm">Edit</Button>
          </NavLink>
        </Col>



      </Row>
      <SeoDetail decodeSlug={decodeSlug} parentslug={parentslug} />






    </Wrapper>
  )
}

export default SeoDetails