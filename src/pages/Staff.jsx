import Wrapper from '../layouts/Wrapper'
import { Button } from 'reactstrap'
import { NavLink } from 'react-router-dom'
import StaffList from '../component/staff/StaffList'
import { ProtectedMethod } from '../guard/RBACGuard'


const Staff = () => {









    return (
        <Wrapper>
            <ProtectedMethod moduleName={"staff"} action='create'>

                <NavLink to={"/management/staff/add"}>
                    <Button type='button' className='btn-main'>Add</Button>
                </NavLink>
            </ProtectedMethod>
            <StaffList />
        </Wrapper>
    )
}

export default Staff