import { useEffect, useRef, useState } from 'react'
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap'
import { useFormik } from 'formik'
import { StaffFormValidation } from '../../helper/ValidationHelper/Validation'
import validateFileImage from '../../utils/ValidationImage'
import Swal from 'sweetalert2'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import BlogServices from '../../services/BlogServices'
import ButtonLoader from '../../utils/Loader/ButtonLoader'
import { useNavigate, useParams } from 'react-router-dom'
import { useCustomQuery } from '../../utils/QueryHooks'
import config from '../../../config'
import StaffServices from '../../services/StaffServices'
import useCustomContext from '../../contexts/Context'


const StaffForm = ({ title }) => {
  const { id } = useParams()
  const [decodeId, setDecodeId] = useState(false)
  const{adminId}=useCustomContext()

  const allowedExtensionsImage = [".jpg", ".jpeg", ".png"]
  const [profileImg, setProfileImg] = useState(null);
  const [showProfileImg, setShowProfileImg] = useState(null);
  const [profileImgErr, setProfileImgErr] = useState("");
  const queryClient = useQueryClient()
  const navigate = useNavigate()



  const fileProfileImgRef = useRef(null);

  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    designation: "",
    phone_number: "",
    password: "",
    role: "0"
  }

  const formik = useFormik({
    initialValues,
    validationSchema: StaffFormValidation,
    onSubmit: (values) => {
      submitHandler(values);
    }
  });

  const handleProfileImage = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    const isFileValid = await validateFileImage(file, 2, allowedExtensionsImage);
    if (!isFileValid?.isValid) {
      setProfileImgErr(isFileValid?.errorMessage);
      return;
    }

    setProfileImg(file);
    setShowProfileImg(URL.createObjectURL(file));
    setProfileImgErr("");
  };



  const submitHandler = (data) => {
    console.log("Form Submitted:", data, profileImg);
    const formData = new FormData()
    formData.append("first_name", data?.first_name)
    formData.append("last_name", data?.last_name)
    formData.append("phone_number", data?.phone_number)
    formData.append("email", data?.email)
    formData.append("designation", data?.designation)
    if (profileImg) {
      formData.append("profile_image", profileImg)
    }


    if (decodeId) {
      formData.append("id", decodeId)
      updatemutation.mutate(formData)
      return
    }
    formData.append("password", data?.password)

    mutation.mutate(formData)
  };


  const mutation = useMutation(
    (formdata) => StaffServices.addStaff(formdata),

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
          text: "Staff created  Successfully",
          icon: "success",
        });
        formik.resetForm()
        setProfileImg(false)
        setProfileImgErr("")
        setShowProfileImg(false)


        queryClient.refetchQueries(["staff-details", data?.data?.data?.id])
        queryClient.refetchQueries(["staff-list", 1])
        navigate("/management/staff/" + btoa(data?.data?.data?.id))

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
  const updatemutation = useMutation(
    (formdata) => StaffServices.updateStaffById(formdata),

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
          text: "Staff updated  Successfully",
          icon: "success",
        });
        formik.resetForm()
        setProfileImg(false)
        setProfileImgErr("")
        setShowProfileImg(false)

        queryClient.refetchQueries(["staff-details", data?.data?.data?.id])
        queryClient.refetchQueries(["staff-list", 1])
        navigate("/management/staff/" + btoa(data?.data?.data?.id))


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





  // Get By Staff
  const {
    data,
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

      formik.setFieldValue("first_name", data?.first_name)
      formik.setFieldValue("last_name", data?.last_name)
      formik.setFieldValue("phone_number", data?.phone_number || "")
      formik.setFieldValue("email", data?.email)
      formik.setFieldValue("designation", data?.designation)
      formik.setFieldValue("password", data?.password)
      formik.setFieldValue("id", data?.id)

      if (data?.profile_image) {


        setShowProfileImg(config.apiUrl + "/" + data?.profile_image)
      }




    }
  });










  useEffect(() => {
    try {
      const decodeId = id && atob(id);

      id && setDecodeId(() => decodeId || "");
    } catch (error) {
      // console.error("Error decoding user ID:", error.message);
      // Handle the error gracefully, e.g., display an error message to the user
      navigate(-1)
    }
  }, [id]);






  return (
    <>
      <h1>{title}</h1>

      <Form onSubmit={formik.handleSubmit}>
        <Row>

          {/* First Name */}
          <Col md="6" className="mb-2">
            <FormGroup className="common-formgroup">
              <Label>First Name *</Label>
              <Input
                type="text"
                {...formik.getFieldProps("first_name")}
                autoComplete="new-first_name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.touched.first_name && formik.errors.first_name ? "is-invalid" : ""}
              />
              {formik.touched.first_name && <p className="text-danger">{formik.errors.first_name}</p>}
            </FormGroup>
          </Col>


          {/* Last Name */}
          <Col md="6" className="mb-2">
            <FormGroup className="common-formgroup">
              <Label>Last Name *</Label>
              <Input
                type="text"
                {...formik.getFieldProps("last_name")}
                autoComplete="new-last_name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.touched.last_name && formik.errors.last_name ? "is-invalid" : ""}
              />
              {formik.touched.last_name && <p className="text-danger">{formik.errors.last_name}</p>}
            </FormGroup>
          </Col>
          {/*Password */}
          {decodeId ? null : <Col md="6" className="mb-2">
            <FormGroup className="common-formgroup">
              <Label>Password *</Label>
              <Input
                type="text"
                {...formik.getFieldProps("password")}
                autoComplete="new-password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.touched.password && formik.errors.password ? "is-invalid" : ""}
              />
              {formik.touched.password && <p className="text-danger">{formik.errors.password}</p>}
            </FormGroup>
          </Col>}

          {/* Email */}
          <Col md="6" className="mb-2">
            <FormGroup className="common-formgroup">
              <Label>Email *</Label>
              <Input
                type="email"
                {...formik.getFieldProps("email")}
                autoComplete="new-email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.touched.email && formik.errors.email ? "is-invalid" : ""}
              />
              {formik.touched.email && <p className="text-danger">{formik.errors.email}</p>}
            </FormGroup>
          </Col>

          {/* Designation */}
          <Col md="6" className="mb-2">
            <FormGroup className="common-formgroup">
              <Label>Designation *</Label>
              <Input
                type="text"
                {...formik.getFieldProps("designation")}
                autoComplete="new-designation"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.touched.designation && formik.errors.designation ? "is-invalid" : ""}
              />
              {formik.touched.designation && <p className="text-danger">{formik.errors.designation}</p>}
            </FormGroup>
          </Col>

          {/* Phone Number */}
          <Col md="6" className="mb-2">
            <FormGroup className="common-formgroup">
              <Label>Phone Number</Label>
              <Input
                type="text"
                {...formik.getFieldProps("phone_number")}
                autoComplete="new-phone_number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.touched.phone_number && formik.errors.phone_number ? "is-invalid" : ""}
              />
              {formik.touched.phone_number && <p className="text-danger">{formik.errors.phone_number}</p>}
            </FormGroup>
          </Col>

          {/* Profile Image */}
          {adminId ? null : <Col md="6" className="mb-2">
            <FormGroup className="common-formgroup">
              <Label>Profile Image (jpg/jpeg/png, max 2MB)</Label>
              <Input
                type="file"
                name="profile_image"
                accept={allowedExtensionsImage}
                onChange={handleProfileImage}
                innerRef={fileProfileImgRef}
                autoComplete="new-profile_image"
                className={profileImgErr ? "is-invalid" : ""}
              />
              {profileImgErr && <p className="text-danger">{profileImgErr}</p>}
              {showProfileImg && (
                <div className="upload-review mt-2">
                  <img
                    src={showProfileImg}
                    alt="Profile Preview"
                    className="img-fluid"
                    height={100}
                    width={100}
                    style={{ objectFit: "cover", borderRadius: "4px" }}
                  />
                </div>
              )}
            </FormGroup>
          </Col>}

          {/* Submit */}
          <Col md="12">
            <FormGroup>
              <Button
                className="btn btn-style1 px-4 py-2"
                type="submit"
                disabled={mutation?.isLoading || updatemutation?.isLoading}
              >
                {mutation?.isLoading || updatemutation?.isLoading ? <ButtonLoader /> : 'Save'}
              </Button>
            </FormGroup>
          </Col>
        </Row>
      </Form>

    </>
  );
};

export default StaffForm;
