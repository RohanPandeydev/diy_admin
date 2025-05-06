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

const SeoList = ({ parentslug }) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [limit, setLimit] = useState(10)
    const queryClient = useQueryClient()
    const [rowId, setRowId] = useState("")

    // Get page from URL, default to 1
    const currentPage = parseInt(searchParams.get('page') || '1');

    const {
        data: categoryList,
        isLoading: isCategoryLoad,
        refetch
    } = useCustomQuery({
        queryKey: ['category-list', currentPage, parentslug],
        service: CategoryServices.categoryList,
        staleTime:0,
        params: buildQueryString([{
            key: "page", value: currentPage || 1,
        }, {
            key: "limit", value: limit || 10
        },
        {
            key: "parent_slug", value: parentslug
        }

        ]),

        enabled: !!parentslug,
        select: (data) => {
            return data?.data;
        },
        errorMsg: "",
        onSuccess: (data) => {

        }
    });








    const renderActions = (row) => (
        <>
            <NavLink to={`/seo/${parentslug}/${btoa(row.slug)}`}>
                <Button color="info" size="sm" className="me-2">View</Button>
            </NavLink>
            <NavLink to={`/seo/${parentslug}/update/${btoa(row.slug)}`}>
                <Button color="primary" size="sm">Edit</Button>
            </NavLink>




        </>
    )











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
            key: "Action",
            label: "",

        },

    ]

    return (
        <>
            {
                isCategoryLoad ? <Loader /> : categoryList?.data?.length == 0 ? <NoDataFound msg={"No Data Found"} /> : <>
                    <TableView headers={headers} data={categoryList?.data} showActions={true} renderActions={renderActions} />

                    <Pagination
                        pagination={categoryList?.pagination}
                    />

                </>
            }

        </>
    )
}

export default SeoList