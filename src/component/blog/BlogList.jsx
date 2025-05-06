import React, { useState } from 'react'
import TableView from '../../utils/TableView'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NavLink, useLocation } from 'react-router-dom';
import { buildQueryString } from '../../utils/BuildQuery';
import Pagination from '../../utils/Pagination';
import { useCustomQuery } from '../../utils/QueryHooks';
import BlogServices from '../../services/BlogServices';
import Loader from '../../utils/Loader/Loader';
import NoDataFound from '../../utils/NoDataFound';
import { Button } from 'reactstrap';
import Swal from 'sweetalert2';
import ButtonLoader from '../../utils/Loader/ButtonLoader';

const BlogList = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [limit, setLimit] = useState(10)
    const queryClient = useQueryClient()
    const [rowId, setRowId] = useState("")

    // Get page from URL, default to 1
    const currentPage = parseInt(searchParams.get('page') || '1');

    const {
        data: blogList,
        isLoading: isBlogLoad,
    } = useCustomQuery({
        queryKey: ['blog-list', currentPage],
        service: BlogServices.blogList,
        params: buildQueryString([{
            key: "page", value: currentPage || 1,
        }, {
            key: "limit", value: limit || 10
        }

        ]),
        select: (data) => {
            return data?.data;
        },
        errorMsg: "",
        onSuccess: (data) => {

        }
    });






    const handleSoftDelete = (row) => {
        setRowId(row?.id)
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


    const renderActions = (row) => (
        <>
            <NavLink to={`/cms/blog/${btoa(row.slug)}`}>
                <Button color="info" size="sm" className="me-2">View</Button>
            </NavLink>
            <NavLink to={`/cms/blog/update/${btoa(row.slug)}`}>
                <Button color="primary" size="sm">Edit</Button>
            </NavLink>

            <Button color="danger" className='mx-2' size="sm" disabled={row.id == rowId || deletemutation?.isLoading} onClick={() => handleSoftDelete(row)}>{row.id == rowId || deletemutation?.isLoading ? <ButtonLoader /> : "Delete"}</Button>



        </>
    )








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

                setRowId("")
                // Swal.fire({
                //   title: "Successful",
                //   text: "Blog updated  Successfully",
                //   icon: "success",
                // });



                queryClient.refetchQueries(["blog-list", 1])
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

                setRowId("")
                Swal.fire({
                    title: "Successful",
                    text: "Blog deleted  Successfully",
                    icon: "success",
                });



                queryClient.refetchQueries(["blog-list", 1])
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
    const headers = [
        {
            key: "category",
            label: "Category",
            category:true

        },
        {
            key: "title",
            label: "Title"

        },
        {
            key: "slug",
            label: "Slug"

        },
        {
            key: "content",
            label: "Content",
            html: true
        },
        {
            key: "cover_image",
            label: "Cover Image",
            image: true
        },

        {
            key: "published_at",
            label: "Published On",
            date: true
        },

        {
            key: "is_published",
            label: "Published",
            id: rowId,
            loader: updatemutation.isLoading,
            onChange: handleChangePublishedStatus

        },
        {
            key: "Action",
            label: "",

        },

    ]
    return (
        <>
            {
                isBlogLoad ? <Loader /> : blogList?.data?.length == 0 ? <NoDataFound msg={"No Blog Found"} /> : <>
                    <TableView headers={headers} data={blogList?.data} showActions={true} renderActions={renderActions} />

                    <Pagination
                        pagination={blogList?.pagination}
                    />

                </>
            }

        </>
    )
}

export default BlogList