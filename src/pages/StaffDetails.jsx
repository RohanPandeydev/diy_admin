import { useEffect, useState } from 'react'
import Wrapper from '../layouts/Wrapper'
import { Button, Col, Row } from 'reactstrap'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import StaffDetail from '../component/staff/StaffDetail'
import { ProtectedMethod } from '../guard/RBACGuard'
const StaffDetails = () => {
  const { id } = useParams()
  const [decodeId, setDecodeId] = useState(false)
  const navigate = useNavigate()









  useEffect(() => {
    try {
      const decodeId = id && atob(id);
      console.log("decodeId", !!id, id);

      id && setDecodeId(() => decodeId || "");
    } catch (error) {
      // console.error("Error decoding user ID:", error.message);
      // Handle the error gracefully, e.g., display an error message to the user
      navigate(-1)
    }
  }, [id]);
  return (
    <Wrapper>
      <Row>
        <Col md={2}>
          <ProtectedMethod moduleName={"staff"} action='update'>

            <NavLink to={`/management/staff/update/${btoa(decodeId)}`}>
              <Button color="primary" size="sm">Edit</Button>
            </NavLink>
          </ProtectedMethod>
        </Col>



      </Row>
      <StaffDetail decodeId={decodeId} />






    </Wrapper>
  )
}

export default StaffDetails