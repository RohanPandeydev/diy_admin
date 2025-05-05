import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap'
import { useFormik } from 'formik'
import { BlogFormValidation } from '../../helper/ValidationHelper/Validation'
import validateFileImage from '../../utils/ValidationImage'
import Editor from '../../utils/Editor'
import Swal from 'sweetalert2'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import BlogServices from '../../services/BlogServices'
import slugify from "slugify";
import ButtonLoader from '../../utils/Loader/ButtonLoader'
import { useNavigate, useParams } from 'react-router-dom'
import { useCustomQuery } from '../../utils/QueryHooks'
import config from '../../../config'
import CategoryServices from '../../services/CategoryServices'
import { buildQueryString } from '../../utils/BuildQuery'

const BlogForm = ({ title }) => {
  const { slug } = useParams()
  const [decodeSlug, setDecodeSlug] = useState(false)

  const allowedExtensionsImage = [".jpg", ".jpeg", ".png"]
  const [coverImg, setCoverImg] = useState(null);
  const [showCoverImg, setShowCoverImg] = useState(null);
  const [coverImgErr, setCoverImgErr] = useState("");
  const queryClient = useQueryClient()
  const navigate = useNavigate()



  const fileCoverImgRef = useRef(null);

  const initialValues = {
    title: "",
    slug: "",
    content: "",
    is_published: false,
    category: ""
  }

  const formik = useFormik({
    initialValues,
    validationSchema: BlogFormValidation,
    onSubmit: (values) => {
      submitHandler(values);
    }
  });

  const handleCoverImage = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    const isFileValid = validateFileImage(file, 2, allowedExtensionsImage);
    if (!isFileValid?.isValid) {
      setCoverImgErr(isFileValid?.errorMessage);
      return;
    }

    setCoverImg(file);
    setShowCoverImg(URL.createObjectURL(file));
    setCoverImgErr("");
  };

  const handleEditorChange = (e) => {
    formik.setFieldValue("content", e.htmlValue);
    formik.setFieldTouched("content", true);
  };

  const submitHandler = (data) => {
    console.log("Form Submitted:", data, coverImg);
    const formData = new FormData()
    formData.append("title", data?.title)
    formData.append("slug", data?.slug)
    formData.append("content", data?.content)
    formData.append("is_published", data?.is_published)
    if (coverImg) {
      formData.append("cover_image", coverImg)
    }


    if (decodeSlug) {
      formData.append("slugId", decodeSlug)
      updatemutation.mutate(formData)
      return
    }
    mutation.mutate(formData)
  };


  const mutation = useMutation(
    (formdata) => BlogServices.addBlog(formdata),

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
          text: "Blog created  Successfully",
          icon: "success",
        });
        formik.resetForm()
        setCoverImg(false)
        setCoverImgErr("")
        setShowCoverImg(false)
        navigate("/blog/" + btoa(data?.data?.data?.slug))


        queryClient.refetchQueries(["blog-details", data?.data?.data?.slug])
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
    (formdata) => BlogServices.updateBlogBySlug(formdata),

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
          text: "Blog updated  Successfully",
          icon: "success",
        });
        formik.resetForm()
        setCoverImg(false)
        setCoverImgErr("")
        setShowCoverImg(false)
        navigate("/blog/" + btoa(decodeSlug))


        queryClient.refetchQueries(["blog-details", decodeSlug])
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





  // Get By Slug
  const {
    data,
    isLoading,
  } = useCustomQuery({
    queryKey: ['blog-details', decodeSlug],
    service: BlogServices.blogBySlug,
    params: { slug: decodeSlug },
    enabled: !!decodeSlug,
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

      formik.setFieldValue("title", data?.title)
      formik.setFieldValue("content", data?.content)
      formik.setFieldValue("slug", data?.slug)
      formik.setFieldValue("is_published", data?.is_published)
      if (data?.cover_image) {
        formik.setFieldValue("slugId", decodeSlug)


        setShowCoverImg(config.apiUrl + "/" + data?.cover_image)
      }





    }
  });
  // Get By Slug Category
  const {
    data: categoryList,
    isLoading: isCategoryLoad,
  } = useCustomQuery({
    queryKey: ['category-list', decodeSlug],
    service: CategoryServices.categoryList,
    params: buildQueryString([{
      key: "page", value: 1,
    }, {
      key: "limit", value: 10

    }, {
      key: "parent_slug", value: decodeSlug
    },
    ]),

    enabled: !!decodeSlug,
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



  console.log(formik.values)




  useEffect(() => {
    if (formik.values.title) {
      const generatedSlug = slugify(formik.values.title, {
        lower: true,
        strict: true,
      });
      formik.setFieldValue("slug", generatedSlug);
    }
  }, [formik.values.title]);




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
    <>
      <h1>{title}</h1>

      <Form onSubmit={formik.handleSubmit}>
        <Row>
          {/* Category */}
          <Col md="6" className="mb-2">
            <FormGroup className="common-formgroup">
              <Label>Category *</Label>
              <Input
                type="text"
                {...formik.getFieldProps("category")}
                autoComplete="new-title"
                className={formik.touched.category && formik.errors.category ? "is-invalid" : ""}
              />
              {formik.touched.category && <p className="text-danger">{formik.errors.category}</p>}
            </FormGroup>
          </Col>
          {/* Title */}
          <Col md="6" className="mb-2">
            <FormGroup className="common-formgroup">
              <Label>Title *</Label>
              <Input
                type="text"
                {...formik.getFieldProps("title")}
                autoComplete="new-title"
                className={formik.touched.title && formik.errors.title ? "is-invalid" : ""}
              />
              {formik.touched.title && <p className="text-danger">{formik.errors.title}</p>}
            </FormGroup>
          </Col>

          {/* Slug */}
          <Col md="6" className="mb-2">
            <FormGroup className="common-formgroup">
              <Label>Slug *</Label>
              <Input
                type="text"
                {...formik.getFieldProps("slug")}
                autoComplete="new-slug"
                className={formik.touched.slug && formik.errors.slug ? "is-invalid" : ""}
              />
              {formik.touched.slug && <p className="text-danger">{formik.errors.slug}</p>}
            </FormGroup>
          </Col>

          {/* Content */}
          <Col md="12" className="mb-2">
            <FormGroup className="common-formgroup">
              <Label>Content *</Label>
              <Editor
                text={formik.values.content}
                handleEditorChange={handleEditorChange}
              />
              {formik.touched.content && <p className="text-danger">{formik.errors.content}</p>}
            </FormGroup>
          </Col>

          {/* Cover Image */}
          <Col md="6" className="mb-2">
            <FormGroup className="common-formgroup">
              <Label>Blog Image (jpg/jpeg/png, max 2MB)</Label>
              <Input
                type="file"
                name="cover_image"
                accept={allowedExtensionsImage}
                onChange={handleCoverImage}
                innerRef={fileCoverImgRef}
                autoComplete="new-cover_image"
                className={coverImgErr ? "is-invalid" : ""}
              />
              {coverImgErr && <p className="text-danger">{coverImgErr}</p>}
              {showCoverImg && (
                <div className="upload-review mt-2">
                  <img
                    src={showCoverImg}
                    alt="Cover Preview"
                    className="img-fluid"
                    height={100}
                    width={100}
                    style={{ objectFit: "cover", borderRadius: "4px" }}
                  />
                </div>
              )}
            </FormGroup>
          </Col>

          {/* Is Published */}
          <Col md="6" className="mb-2">
            <FormGroup className="common-formgroup">
              <Label>Published</Label>
              <div className="d-flex gap-3">
                <FormGroup check>
                  <Label check>
                    <Input
                      type="radio"
                      name="is_published"
                      value={true}
                      checked={formik.values.is_published === true}
                      onChange={() => formik.setFieldValue("is_published", true)}
                    />{" "}
                    Yes
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="radio"
                      name="is_published"
                      value={false}
                      checked={formik.values.is_published === false}
                      onChange={() => formik.setFieldValue("is_published", false)}
                    />{" "}
                    No
                  </Label>
                </FormGroup>
              </div>
              {formik.touched.is_published && <p className="text-danger">{formik.errors.is_published}</p>}
            </FormGroup>
          </Col>

          {/* Submit */}
          <Col md="12">
            <FormGroup>
              <Button
                className="btn btn-style1 px-4 py-2"
                type="submit"
                disabled={mutation?.isLoading || updatemutation?.isLoading}

              >
                {
                  mutation.isLoading || updatemutation?.isLoading ? <ButtonLoader /> : 'Create'
                }

              </Button>
            </FormGroup>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default BlogForm;
