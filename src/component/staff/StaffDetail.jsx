import React from 'react'
import { Button, Col, Row } from 'reactstrap'
import { useCustomQuery } from '../../utils/QueryHooks'
import BlogServices from '../../services/BlogServices'
import Loader from '../../utils/Loader/Loader'
import Swal from 'sweetalert2'
import config from '../../../config'
import parse from 'html-react-parser'
import moment from 'moment'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import ButtonLoader from '../../utils/Loader/ButtonLoader'
import { NavLink, useNavigate } from 'react-router-dom'
import StaffServices from '../../services/StaffServices'
import { ProtectedMethod } from '../../guard/RBACGuard'

const StaffDetail = ({ decodeId }) => {

  const queryClient = useQueryClient()
  const navigate = useNavigate()



  // Get By Slug
  const {
    data: staffDetails,
    isLoading,
  } = useCustomQuery({
    queryKey: ['staff-details', decodeId],
    service: StaffServices.staffById,
    params: { id: decodeId },
    enabled: !!decodeId,
    staleTime: 0,
    select: (data) => {
      if (!data?.data?.status) {
        Swal.fire({
          title: "Error",
          text: data?.data?.message,
          icon: "error",
        });
        return
      }
      return data?.data?.data;
    },
    errorMsg: "",
    onSuccess: (data) => {

    }
  });



  const handleSoftDelete = (row) => {

    Swal.fire({
      title: "Are you sure?",
      text: "This staff will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it",
    }).then((result) => {
      if (result.isConfirmed) {
        setRowId(row?.id)
        deletemutation.mutate({ id: row?.id });

      }
    });

  };




  const deletemutation = useMutation(
    (formdata) => StaffServices.softDeleteStaff(formdata),

    {
      onSuccess: (data) => {
        if (!data?.data?.status) {
          Swal.fire({
            title: "Error",
            text: data?.data?.message,
            icon: "error",
          });
          return
        }

        Swal.fire({
          title: "Successful",
          text: "Staff deleted  Successfully",
          icon: "success",
        });



        queryClient.refetchQueries(["staff-list", 1])
        navigate('/management/staff')
        return;
      },
      onError: (err) => {
        Swal.fire({
          title: "Error",
          text: err?.response?.data?.message || err?.message,
          icon: "error",
        });
        return;
      },
    }
  );










  return (
    <>

      {isLoading ? null : <ProtectedMethod moduleName={"staff"} action='delete'><Button color="danger" className='mx-2' size="sm" disabled={deletemutation?.isLoading} onClick={() => handleSoftDelete(staffDetails)}>{deletemutation?.isLoading ? <ButtonLoader /> : "Delete"}</Button></ProtectedMethod>}

      {
        isLoading ? <Loader /> : <Row>
          {/* Staff Info */}
          <Col lg={8} md={6}>
            <div className="order-desc-info-box">
              <h3>
                Name: {staffDetails?.first_name} {staffDetails?.last_name}
              </h3>
              <h5>
                <span>Email: {staffDetails?.email}</span>
              </h5>
              <h5>
                <span>Designation: {staffDetails?.designation}</span>
              </h5>
              <h5>
                <span>Phone Number: {staffDetails?.phone_number || "N/A"}</span>
              </h5>
            </div>
          </Col>

          {/* Profile Image */}
          {staffDetails?.profile_img && (
            <Col lg={4} md={6} className="text-end">
              <img
                src={`${config.apiUrl}/${staffDetails.profile_img}`}
                alt="Profile"
                height={100}
                width={100}
                style={{ objectFit: 'cover', borderRadius: '6px' }}
              />
            </Col>
          )}
        </Row>
      }






    </>
  )
}

export default StaffDetail