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

const BlogDetail = ({ decodeSlug }) => {

  const queryClient = useQueryClient()
  const navigate = useNavigate()



  // Get By Slug
  const {
    data: blogDetails,
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

    }
  });



  const handleSoftDelete = (row) => {
    if (row.is_published) {
      Swal.fire({
        title: "Unpublish Required",
        text: "Please unpublish this blog before deleting it.",
        icon: "warning",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "This blog will be deleted.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it",
      }).then((result) => {
        if (result.isConfirmed) {
          deletemutation.mutate({ id: row?.id });
        }
      });
    }
  };




  const deletemutation = useMutation(
    (formdata) => BlogServices.softDeleteBlog(formdata),

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
          text: "Blog deleted  Successfully",
          icon: "success",
        });



        queryClient.refetchQueries(["blog-list", 1])
        navigate('/blog')
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









  const handleChangePublishedStatus = (row) => {
    Swal.fire({
      title: row.is_published ? "Unpublish this blog?" : "Publish this blog?",
      text: "Are you sure you want to change the publish status?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed",
    }).then((result) => {
      if (result.isConfirmed) {
        updatemutation.mutate({
          slugId: row?.slug,
          is_published: !row.is_published,
        });
      }
    });

  }

  const updatemutation = useMutation(
    (formdata) => BlogServices.updateBlogStatusBySlug(formdata),

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

        // Swal.fire({
        //   title: "Successful",
        //   text: "Blog updated  Successfully",
        //   icon: "success",
        // });



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


  return (
    <>

      {isLoading ? null : <Button color="danger" className='mx-2' size="sm" disabled={deletemutation?.isLoading} onClick={() => handleSoftDelete(blogDetails)}>{deletemutation?.isLoading ? <ButtonLoader /> : "Delete"}</Button>}

      {
        isLoading ? <Loader /> : <Row>
          <Col lg={8} md={6}>

            <div className="order-desc-info-box">
              <h3>Category:
                <NavLink   to={"/seo/" + blogDetails?.category?.parent?.slug + "/" + btoa(blogDetails?.category?.slug)}>
                  {blogDetails?.category?.name}

                </NavLink>
              </h3>
              <h3>Title:{blogDetails?.title}</h3>
              <h5>
                <span>Slug : {blogDetails?.slug}</span>
              </h5>
              <div className="order-cus-details">
                <h4>
                  {
                    blogDetails.content ? parse(blogDetails?.content) : null
                  }
                </h4>
                {
                  blogDetails?.is_published ? <p className="order-cus-email">Published On : {moment(blogDetails?.published_at).format("lll")}</p> : null
                }




              </div>





              <label>

                <input type='radio' name={'publish-' + decodeSlug} checked={blogDetails?.is_published == true} onChange={() => handleChangePublishedStatus(blogDetails)} />
                Published





              </label>
              <label>

                <input type='radio' name={'publish-' + decodeSlug} checked={blogDetails?.is_published == false} onChange={() => handleChangePublishedStatus(blogDetails)} />
                Unpublished





              </label>


























            </div>
          </Col>
          {blogDetails?.cover_image ? <Col lg={4} md={6}>
            <img src={config.apiUrl + "/" + blogDetails?.cover_image} height={100} width={100} />

          </Col> : null}

        </Row>
      }






    </>
  )
}

export default BlogDetail