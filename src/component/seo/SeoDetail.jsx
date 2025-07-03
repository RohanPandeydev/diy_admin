import React from 'react'
import { Col, Row } from 'reactstrap'
import { useCustomQuery } from '../../utils/QueryHooks'
import Loader from '../../utils/Loader/Loader'

import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
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



            {
                isLoadSeo ? (
                    <Loader />
                ) : !seoDetails?.status ? (
                    <NoDataFound msg="No SEO Found" />
                ) : (
                    <div className="seo-content-container">

                        <div className='seo-content-box'>
                            <h3>Title:</h3>
                            <p> {seoDetails?.data?.title}</p>
                        </div>
                        <div className='seo-content-box'>
                            <h3>Slug:</h3><p> {seoDetails?.data?.slug}</p>
                        </div>
                        <div className='seo-content-box'>
                            <h3>Meta Title:</h3><p> {seoDetails?.data?.meta_title || '—'}</p>
                        </div>
                        <div className='seo-content-box'>
                            <h3>Meta Description:</h3><p> {seoDetails?.data?.meta_description || '—'}</p>
                        </div>
                        <div className='seo-content-box'>
                            <h3>Meta Keywords:</h3><p> {seoDetails?.data?.meta_keywords || '—'}</p>
                        </div>
                        <div className='seo-content-box'>
                            <h3>Canonical URL:</h3>{seoDetails?.data?.canonical_url?<a href={seoDetails?.data?.canonical_url} target='_diy'> {seoDetails?.data?.canonical_url || '—'}</a>:"N/A"}
                        </div>
                        <div className='seo-content-box'>
                            <h3>OG Title:</h3><p> {seoDetails?.data?.og_title || '—'}</p>
                        </div>
                        <div className='seo-content-box'>
                            <h3>OG Description:</h3><p> {seoDetails?.data?.og_description || '—'}</p>
                        </div>
                        <div className='seo-content-box'>
                            <h3>OG Type:</h3><p> {seoDetails?.data?.og_type}</p>
                        </div>
                        <div className='seo-content-box'>
                            <h3>Robots:</h3><p> {seoDetails?.data?.robots}</p>
                        </div>
                        <div className='seo-content-box'>
                            <h3>Category:</h3><p> {seoDetails?.data?.category?.name || '—'}</p>
                        </div>
                        <div className='seo-content-box'>
                            <h3>Category Slug:</h3><p> {seoDetails?.data?.category?.slug || '—'}</p>
                        </div>

                        <div md="12" className="mb-3">
                            <h3>Header Scripts:</h3>
                            <pre className="bg-light p-2 rounded small">
                                <p> {seoDetails?.data?.custom_head_scripts ? JSON.parse(seoDetails?.data?.custom_head_scripts || "{}") : null}</p>
                            </pre>
                        </div>
                        <div md="12" className="mb-3">
                            <h3>Footer Scripts:</h3>
                            <pre className="bg-light p-2 rounded small">
                                <p> {seoDetails?.data?.custom_footer_scripts ? JSON.parse(seoDetails?.data?.custom_footer_scripts || "{}") : null}</p>
                            </pre>
                        </div>

                        <p> {seoDetails?.data?.og_image && (
                            <div className='seo-content-box'>
                                <h3>OG Image:</h3>
                                <div>
                                    <img
                                        src={config.apiUrl + "/" + seoDetails.data.og_image}
                                        alt="OG Preview"
                                        style={{ maxWidth: "100%", height: "auto", border: "1px solid #ddd", borderRadius: "8px", marginTop: "5px" }}
                                    />
                                </div>
                            </div>

                        )}
                        </p>
                    </div>
                )
            }






        </>
    )
}

export default SeoDetail