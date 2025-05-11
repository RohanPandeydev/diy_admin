import React from 'react'
import {  Col, Row } from 'reactstrap'
import { useCustomQuery } from '../../utils/QueryHooks'
import Loader from '../../utils/Loader/Loader'

import {  useQueryClient } from '@tanstack/react-query'
import {  useNavigate } from 'react-router-dom'
import NoDataFound from '../../utils/NoDataFound'
import SeoServices from '../../services/SeoServices'
import config from '../../../config'

const SeoDetail = ({ parentslug, childslug, gslug, slugToCall }) => {

    const queryClient = useQueryClient()
    const navigate = useNavigate()














    // SEO Get By Slug
    const {
        data: seoDetails,
        isLoading: isLoadSeo,
    } = useCustomQuery({
        queryKey: ['seo-details-by-slug', parentslug, childslug, gslug, slugToCall],
        service: SeoServices.seoBySlug,
        params: { slug: slugToCall },
        enabled: !!slugToCall,
        staleTime: 0,
        onSuccess: (data) => {
            if (!data?.status) {



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
                                        src={ config.apiUrl +"/"+ seoDetails.data.og_image}
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