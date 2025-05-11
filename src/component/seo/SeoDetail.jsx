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
import CategoryServices from '../../services/CategoryServices'
import { buildQueryString } from '../../utils/BuildQuery'
import NoDataFound from '../../utils/NoDataFound'
import SeoServices from '../../services/SeoServices'

const SeoDetail = ({ decodeSlug, parentslug }) => {

    const queryClient = useQueryClient()
    const navigate = useNavigate()



    // Get By Slug
    const {
        data: categoryDetails,
        isLoading,
    } = useCustomQuery({
        queryKey: ['category-details', decodeSlug, parentslug],
        service: CategoryServices.categoryBySlug,
        params: { slug: decodeSlug },
        enabled: !!decodeSlug && !!parentslug,
        staleTime: 0,
        select: (data) => {
            // if (!data?.data?.status) {
            //     Swal.fire({
            //         title: "Error",
            //         text: data?.data?.message,
            //         icon: "error",
            //     });
            //     return
            // }
            return data?.data?.data;
        },
        errorMsg: "",
        onSuccess: (data) => {

        }
    });






    const {
        data: categoryList,
        isLoading: isCategoryLoad,

    } = useCustomQuery({
        queryKey: ['category-list', decodeSlug],
        service: CategoryServices.categoryList,
        staleTime: 0,
        params: buildQueryString([{
            key: "page", value: 1,
        }, {
            key: "limit", value: 10
        },
        {
            key: "parent_slug", value: decodeSlug
        }

        ]),

        enabled: !!decodeSlug,
        select: (data) => {
            return data?.data?.data;
        },
        errorMsg: "",
        onSuccess: (data) => {

        }
    });







    // SEO Get By Slug
    const {
        data: seoDetails,
        isLoading: isLoadSeo,
    } = useCustomQuery({
        queryKey: ['seo-details-by-slug', decodeSlug],
        service: SeoServices.seoBySlug,
        params: { slug: decodeSlug },
        enabled: !!decodeSlug && !!parentslug,
        staleTime: 0,
        onSuccess: (data) => {
            if (!data?.status) {
                // Swal.fire({
                //     title: "Error",
                //     text: data?.message,
                //     icon: "error",

                // });


                return
            }


        },
        select: (data) => {


            return data?.data;
        },

        errorMsg: "",

    });





    return (
        <>



            {
                isLoading ? <Loader /> : <Row>
                    <Col lg={8} md={6}>

                        <div className="order-desc-info-box">
                            <h3>Category:{categoryDetails?.parent?.name}</h3>
                            <h3>Name:{categoryDetails?.name}</h3>
                            <h5>
                                <span>Slug : {categoryDetails?.slug}</span>
                            </h5>
                        </div>
                    </Col>


                </Row>
            }

            <h4 className='mt-2'>Sub Category</h4>

            {
                isCategoryLoad ? <Loader /> : categoryList?.length == 0 ? <NoDataFound msg={"No Sub Category Found"} /> : <Row>



                    {
                        categoryList?.map((each) => {
                            return <Col lg={8} md={6}>

                                <div className="order-desc-info-box">
                                    <h3>Name:{each?.name}</h3>
                                    <h5>
                                        <span>Slug : {each?.slug}</span>
                                    </h5>
                                </div>
                                <NavLink to={`/seo/${decodeSlug}/update/${btoa(each?.slug)}`}>
                                    <Button color="primary" size="sm">Edit</Button>
                                </NavLink>
                                <NavLink to={`/seo/${decodeSlug}/${btoa(each?.slug)}`}>
                                    <Button color="primary" size="sm">View</Button>
                                </NavLink>
                            </Col>
                        })
                    }



                </Row>
            }
            <h4 className='mt-2'>SEO</h4>
            {
                isLoadSeo ? (
                    <Loader />
                ) : !seoDetails?.status ? (
                    <NoDataFound msg="No SEO Found" />
                ) : (
                    <Row>
                        <Col md="6" className="mb-3">
                            <strong>Title:</strong> {seoDetails?.data?.title}
                        </Col>
                        <Col md="6" className="mb-3">
                            <strong>Slug:</strong> {seoDetails?.data?.slug}
                        </Col>
                        <Col md="6" className="mb-3">
                            <strong>Meta Title:</strong> {seoDetails?.data?.meta_title || '—'}
                        </Col>
                        <Col md="6" className="mb-3">
                            <strong>Meta Description:</strong> {seoDetails?.data?.meta_description || '—'}
                        </Col>
                        <Col md="6" className="mb-3">
                            <strong>Meta Keywords:</strong> {seoDetails?.data?.meta_keywords || '—'}
                        </Col>
                        <Col md="6" className="mb-3">
                            <strong>Canonical URL:</strong> {seoDetails?.data?.canonical_url || '—'}
                        </Col>
                        <Col md="6" className="mb-3">
                            <strong>OG Title:</strong> {seoDetails?.data?.og_title || '—'}
                        </Col>
                        <Col md="6" className="mb-3">
                            <strong>OG Description:</strong> {seoDetails?.data?.og_description || '—'}
                        </Col>
                        <Col md="6" className="mb-3">
                            <strong>OG Type:</strong> {seoDetails?.data?.og_type}
                        </Col>
                        <Col md="6" className="mb-3">
                            <strong>Robots:</strong> {seoDetails?.data?.robots}
                        </Col>
                        <Col md="6" className="mb-3">
                            <strong>Category:</strong> {seoDetails?.data?.category?.name || '—'}
                        </Col>
                        <Col md="6" className="mb-3">
                            <strong>Category Slug:</strong> {seoDetails?.data?.category?.slug || '—'}
                        </Col>

                        <Col md="12" className="mb-3">
                            <strong>Header Scripts:</strong>
                            <pre className="bg-light p-2 rounded small">
                                {seoDetails?.data?.custom_head_scripts ? JSON.parse(seoDetails?.data?.custom_head_scripts || "{}") : null}
                            </pre>
                        </Col>
                        <Col md="12" className="mb-3">
                            <strong>Footer Scripts:</strong>
                            <pre className="bg-light p-2 rounded small">
                                {seoDetails?.data?.custom_footer_scripts ? JSON.parse(seoDetails?.data?.custom_footer_scripts || "{}") : null}
                            </pre>
                        </Col>

                        {seoDetails?.data?.og_image && (
                            <Col md="6" className="mb-3">
                                <strong>OG Image:</strong>
                                <div>
                                    <img
                                        src={seoDetails.data.og_image}
                                        alt="OG Preview"
                                        style={{ maxWidth: "100%", height: "auto", border: "1px solid #ddd", borderRadius: "8px", marginTop: "5px" }}
                                    />
                                </div>
                            </Col>
                        )}
                    </Row>
                )
            }






        </>
    )
}

export default SeoDetail