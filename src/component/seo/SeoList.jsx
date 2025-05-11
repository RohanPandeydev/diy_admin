import React, { useState } from 'react'
import TableView from '../../utils/TableView'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NavLink, useLocation } from 'react-router-dom';
import { buildQueryString } from '../../utils/BuildQuery';
import Pagination from '../../utils/Pagination';
import { useCustomQuery } from '../../utils/QueryHooks';
import Loader from '../../utils/Loader/Loader';
import NoDataFound from '../../utils/NoDataFound';
import { Button } from 'reactstrap';
import Swal from 'sweetalert2';
import ButtonLoader from '../../utils/Loader/ButtonLoader';
import CategoryServices from '../../services/CategoryServices';
import SeoServices from '../../services/SeoServices';

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
                to={`/seo${parentslug ? `/${parentslug}` : ""}${childslug ? `/${childslug}` : ""}${gslug ? `/${gslug}` : ""}/details`}
            >
                <Button color="info" size="sm" className="me-2">View</Button>
            </NavLink>

        </>
    );









    const headers = [
        {
            key: "name",
            label: "Name"
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
            key: "og_type",
            label: "OG Type"
        },
        {
            key: "robots",
            label: "Robots"
        },
        {
            key: "custom_head_scripts",
            label: "Head Scripts",
            Json: true,
        },
        {
            key: "custom_footer_scripts",
            label: "Footer Scripts",
            Json: true,

        },
        {
            key: "google_cseid",
            label: "Google CSE ID"
        },
        {
            key: "Action",
            label: ""
        }
    ];
    return (
        <>
            {isSeoDetailsLoad ? "" : <>


                <NavLink
                    to={`/seo${parentslug ? `/${parentslug}` : ""}${childslug ? `/${childslug}` : ""}${gslug ? `/${gslug}` : ""}/update`}
                >
                    <Button color="primary" size="sm">{seoDetails?.length !== 0 ? "Edit" : "Add"}</Button>
                </NavLink>
            </>}
            {
                isSeoDetailsLoad ? <Loader /> : seoDetails?.length == 0 ? <NoDataFound msg={"No SEO Found"} /> : <>
                    <TableView headers={headers} data={seoDetails} showActions={true} renderActions={renderActions} />



                </>
            }

        </>
    )
}

export default SeoList