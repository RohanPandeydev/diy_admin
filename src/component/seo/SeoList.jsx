import React, { useState } from 'react'
import TableView from '../../utils/TableView'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { buildQueryString } from '../../utils/BuildQuery';
import Pagination from '../../utils/Pagination';
import { useCustomQuery } from '../../utils/QueryHooks';
import Loader from '../../utils/Loader/Loader';
import NoDataFound from '../../utils/NoDataFound';
import { Button, Col, Row } from 'reactstrap';
import Swal from 'sweetalert2';
import ButtonLoader from '../../utils/Loader/ButtonLoader';
import CategoryServices from '../../services/CategoryServices';
import SeoServices from '../../services/SeoServices';
import { ProtectedMethod } from '../../guard/RBACGuard';
import { FaEdit, FaEye } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';

const SeoList = ({ parentslug, childslug, gslug, slugToCall }) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const {
        data: seoDetails,
        isLoading: isSeoDetailsLoad,

    } = useCustomQuery({
        queryKey: ['seo-by-slug', slugToCall, gslug, childslug, parentslug],
        service: SeoServices.seoBySlug,
        staleTime: 0,

        params: { slug: slugToCall },




        enabled: !!slugToCall,
        select: (data) => {
            if (!data?.data?.status) {
                return []
            }
            return [data?.data?.data];
        },
        errorMsg: "",
        onSuccess: (data) => {

        }
    });






    const renderActions = (row) => (
        <>
            <NavLink
                to={`/seo${parentslug ? `/${parentslug}` : ""}${childslug ? `/${childslug}` : ""}${gslug ? `/${gslug}` : ""}/details`}>
                <Button color="info" size="sm" className="me-2"><FaEye /> </Button>
            </NavLink>

        </>
    );









    const headers = [
        {
            key: "title",
            label: "Title"
        },
        {
            key: "slug",
            label: "Slug"
        },

        {
            key: "meta_title",
            label: "Meta Title"
        },
        {
            key: "meta_description",
            label: "Meta Description"
        },
        {
            key: "meta_keywords",
            label: "Meta Keywords"
        },
        {
            key: "canonical_url",
            label: "Canonical URL"
        },
        {
            key: "og_title",
            label: "OG Title"
        },
        {
            key: "og_description",
            label: "OG Description"
        },


        {
            key: "google_cseid",
            label: "Google CSE ID"
        },
        {
            key: "Action",
            label: "",
            isAction: true,
        }
    ];
    return (
        <>
            <div className='seo-header-container'>
                <h6>SEO</h6>
                {isSeoDetailsLoad ? "" : <>
                    <ProtectedMethod moduleName={"seo"} action='update'>
                        <NavLink to={`/seo${parentslug ? `/${parentslug}` : ""}${childslug ? `/${childslug}` : ""}${gslug ? `/${gslug}` : ""}/update`}>
                            <Button className='back-button mt-3'><FaEdit />Edit</Button>
                        </NavLink>
                    </ProtectedMethod>
                </>}
            </div>
            {
                isSeoDetailsLoad ? <Loader /> : seoDetails?.length == 0 ? <NoDataFound msg={"No SEO Found"} /> : <>
                    {/* <TableView headers={headers} data={seoDetails} showActions={true} renderActions={renderActions} /> */}

                    <div className="seo-content-container">
                        <div className='seo-content-box'>
                            <h3>Title</h3>
                            <p>home-Title</p>
                        </div>

                        <div className='seo-content-box'>
                            <h3>Slug</h3>
                            <p>home</p>
                        </div>

                        <div className='seo-content-box'>
                            <h3>Meta Title</h3>
                            <p>Welcome to Our Website - Home-title</p>
                        </div>

                        <div className='seo-content-box'>
                            <h3>Meta Description</h3>
                            <p>Discover our latest features, services, and updates. Explore our homepage to learn more.--Description</p>
                        </div>

                        <div className='seo-content-box'>
                            <h3>Meta Keywords</h3>
                            <p>homepage, welcome, services, features, updates</p>
                        </div>

                        <div className='seo-content-box'>
                            <h3>Canonical URL</h3>
                            <p>
                                <Link>https://example.com/diy-prefab-kits/wall-and-roofing-solutions</Link>
                            </p>
                        </div>

                        <div className='seo-content-box'>
                            <h3>OG Title</h3>
                            <p>Welcome to Our Website</p>
                        </div>

                        <div className='seo-content-box'>
                            <h3>OG Description</h3>
                            <p>Check out the homepage to explore our services and recent updates.</p>
                        </div>

                        <div className='seo-content-box'>
                            <h3>Google CSE ID</h3>
                            <p>012345678901234567890:diykitsearch</p>
                        </div>
                        <div className='seo-content-box'>
                            <h3>OG Type:</h3>
                            <p>website</p>
                        </div>
                        <div className='seo-content-box'>
                            <h3>Robots:</h3>
                            <p>index, follow</p>
                        </div>
                        <div className='seo-content-box'>
                            <h3>Category:</h3>
                            <p>Home</p>
                        </div>
                        <div className='seo-content-box'>
                            <h3>Category Slug:</h3>
                            <p>home</p>
                        </div>
                    </div>
                    <div className="seo-header-footer-tag">
                        <div className='seo-content-box'>
                            <h3>Header Scripts:</h3>
                            <h4>
                                {"<script>console.log('Head script loaded');</script>"}
                            </h4>
                        </div>
                        <div className='seo-content-box'>
                            <h3>Footer Scripts:</h3>
                            <h4>
                                {"<script>console.log('Footer script loaded');</script>"}
                            </h4>
                        </div>
                    </div>
                </>
            }

        </>
    )
}

export default SeoList