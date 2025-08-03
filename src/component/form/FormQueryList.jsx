import React, { useState } from 'react'
import TableView from '../../utils/TableView'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { buildQueryString } from '../../utils/BuildQuery';
import Pagination from '../../utils/Pagination';
import { useCustomQuery } from '../../utils/QueryHooks';
import BlogServices from '../../services/BlogServices';
import Loader from '../../utils/Loader/Loader';
import NoDataFound from '../../utils/NoDataFound';
import { Button, Col, FormGroup, Input, Row, Badge, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Swal from 'sweetalert2';
import ButtonLoader from '../../utils/Loader/ButtonLoader';
import CategoryServices from '../../services/CategoryServices';
import AsyncSelect from 'react-select/async';
import { useEffect } from 'react';
import ProtectedRoute, { ProtectedMethod } from '../../guard/RBACGuard';

import { BiReset } from "react-icons/bi";
import { FaEye, FaRegEdit, FaEllipsisV } from 'react-icons/fa';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import FormServices from '../../services/FormServices';

const FormQueryList = ({ queryValue }) => {
    const navigate = useNavigate()
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [limit, setLimit] = useState(10)
    const queryClient = useQueryClient()
    const [rowId, setRowId] = useState("")
    const [key, setKey] = useState(0); // Add this state to force re-render

    const [searchFilter, setSearchFilter] = useState({
        search: "",
        status: "",
        form_type: ""
    })

    // Get page from URL, default to 1
    const currentPage = parseInt(searchParams.get('page') || '1');

    const {
        data: queryList,
        isLoading: isQueryLoad,
    } = useCustomQuery({
        queryKey: ['query-list', currentPage, searchFilter, queryValue],
        service: FormServices.formQuery,
        params: buildQueryString([{
            key: "page", value: currentPage || 1,
        }, {
            key: "limit", value: limit || 10
        },
        {
            key: "search", value: searchFilter?.search
        },
        {
            key: "status", value: searchFilter?.status
        },
        {
            key: "form_type", value: queryValue
        }
        ]),
        select: (data) => {
            return data?.data;
        },
        errorMsg: "",
        onSuccess: (data) => {

        }
    });

    const handleSearch = (e) => {
        const name = e.target.name
        const value = e.target?.value

        setSearchFilter({
            ...searchFilter, [name]: value
        })

        // Update search parameters
        searchParams.set('page', '1'); // Reset page to 1 on filter change

        // Navigate to new URL with updated search params
        navigate(`${location.pathname}?${searchParams.toString()}`);
    }

    const handleResetFilter = () => {
        setSearchFilter({
            search: "",
            status: "",
            form_type: ""
        })
        // Update search parameters
        searchParams.set('page', '1'); // Reset page to 1 on filter change

        // Navigate to new URL with updated search params
        navigate(`${location.pathname}?${searchParams.toString()}`);
    }

    const handleSoftDelete = (row) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This query will be deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it",
        }).then((result) => {
            if (result.isConfirmed) {
                setRowId(row?.id)
                deletemutation.mutate({ id: row?.id });
            }
        });
    };

    const renderActions = (row) => (
        <>


                <Button color="danger" className='mx-1' size="sm" disabled={row.id == rowId || deletemutation?.isLoading} onClick={() => handleSoftDelete(row)}>
                    {row.id == rowId || deletemutation?.isLoading ? <ButtonLoader /> : <MdOutlineDeleteOutline />}
                </Button>
        </>
    )

    const handleViewDetails = (row) => {
        Swal.fire({
            title: `Form Details - ${row.name}`,
            html: `
                <div style="text-align: left;">
                    <p><strong>Name:</strong> ${row.name}</p>
                    <p><strong>Email:</strong> ${row.email}</p>
                    <p><strong>Phone:</strong> ${row.phone || 'N/A'}</p>
                    <p><strong>Company:</strong> ${row.company || 'N/A'}</p>
                    <p><strong>Subject:</strong> ${row.subject || 'N/A'}</p>
                    <p><strong>Message:</strong> ${row.message || 'N/A'}</p>
                    <p><strong>Interest of Services:</strong> ${row.interest_of_services || 'N/A'}</p>
                    <p><strong>Form Type:</strong> ${row.form_type}</p>
                    <p><strong>Status:</strong> ${row.status}</p>
                    <p><strong>Created:</strong> ${new Date(row.created_at).toLocaleDateString()}</p>
                </div>
            `,
            width: '600px',
            confirmButtonText: 'Close'
        });
    }

    const handleChangeFormStatus = (row, status) => {
        const currentStatus = row.status;
        
        // Status flow validation
        if (currentStatus === 'completed' || currentStatus === 'rejected') {
            Swal.fire({
                title: "Status Cannot Be Changed",
                text: "Once a form is completed or rejected, the status cannot be modified.",
                icon: "warning",
                confirmButtonText: "OK"
            });
            return;
        }
        
        if (currentStatus === 'in_progress' && status === 'new') {
            Swal.fire({
                title: "Invalid Status Change",
                text: "Cannot go back to 'New' status once 'In Progress'.",
                icon: "warning",
                confirmButtonText: "OK"
            });
            return;
        }
        
        setRowId(row?.id)
        updatemutation.mutate({
            id: row?.id,
            status: status,
        });
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            'new': { color: 'primary', text: 'New' },
            'in_progress': { color: 'warning', text: 'In Progress' },
            'completed': { color: 'success', text: 'Completed' },
            'rejected': { color: 'danger', text: 'Rejected' }
        };
        
        const config = statusConfig[status] || { color: 'secondary', text: status };
        return <Badge color={config.color}>{config.text}</Badge>;
    }

    const getFormTypeLabel = (formType) => {
        const typeLabels = {
            'design_consultant': 'Design Consultant',
            'inquiry': 'Inquiry',
            'contact': 'Contact'
        };
        return typeLabels[formType] || formType;
    }

    const renderFormContent = (row) => {
        let content = '';
        
        if (row.message) {
            content += row.message;
        }
        
        if (row.interest_of_services) {
            if (content) content += '<br><br>';
            content += `<strong>Interest:</strong> ${row.interest_of_services}`;
        }
        
        if (row.subject) {
            if (content) content += '<br><br>';
            content += `<strong>Subject:</strong> ${row.subject}`;
        }
        
        return content || 'No content available';
    }

    const updatemutation = useMutation(
        (formdata) => FormServices.updateFormQuery(formdata),
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
                    title: "Success",
                    text: "Status updated successfully",
                    icon: "success",
                });

                queryClient.refetchQueries(["query-list", currentPage])
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
        (formdata) => FormServices.delete(formdata),
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
                    text: "Query deleted Successfully",
                    icon: "success",
                });

                queryClient.refetchQueries(["query-list", currentPage])
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

    const getHeadersByFormType = () => {
        const baseHeaders = [
            {
                key: "name",
                label: "Name",
            },
            {
                key: "email",
                label: "Email"
            }
        ];

        const statusHeader = {
            key: "status",
            label: "Status",
            badge: true,
            render: (value, row) => {
                // Status flow restrictions
                const isCompleted = value === 'completed';
                const isRejected = value === 'rejected';
                const isInProgress = value === 'in_progress';
                const isNew = value === 'new';
                
                // If completed or rejected, disable all options
                if (isCompleted || isRejected) {
                    return (
                        <select 
                            className="form-select form-select-sm" 
                            value={value} 
                            disabled={true}
                        >
                            <option value="new">New</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    );
                }
                
                return (
                    <select 
                        className="form-select form-select-sm" 
                        value={value} 
                        onChange={(e) => handleChangeFormStatus(row, e.target.value)}
                        disabled={row.id == rowId || updatemutation?.isLoading}
                    >
                        <option value="new" disabled={isInProgress}>New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                    </select>
                );
            }
        };

        const commonHeaders = [
            {
                key: "createdAt",
                label: "Created On",
                date: true
            },
            {
                key: "Action",
                label: "",
                isAction: true
            }
        ];

        switch (queryValue) {
            case 'design_consultant':
                return [
                    ...baseHeaders,
                    {
                        key: "phone",
                        label: "Phone",
                        render: (value) => value || 'N/A'
                    },
                    statusHeader,
                    ...commonHeaders
                ];

            case 'inquiry':
                return [
                    ...baseHeaders,
                    {
                        key: "interest_of_services",
                        label: "Interest of Services",
                        render: (value) => value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : 'N/A'
                    },
                    {
                        key: "message",
                        label: "Message",
                        render: (value) => value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : 'N/A'
                    },
                    statusHeader,
                    ...commonHeaders
                ];

            case 'contact':
                return [
                    ...baseHeaders,
                    {
                        key: "company",
                        label: "Company",
                        render: (value) => value || 'N/A'
                    },
                    {
                        key: "phone",
                        label: "Phone",
                        render: (value) => value || 'N/A'
                    },
                    {
                        key: "subject",
                        label: "Subject",
                        render: (value) => value || 'N/A'
                    },
                    {
                        key: "message",
                        label: "Message",
                        render: (value) => value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : 'N/A'
                    },
                    statusHeader,
                    ...commonHeaders
                ];

            default:
                // Default case - show all columns
                return [
                    ...baseHeaders,
                    {
                        key: "phone",
                        label: "Phone",
                        render: (value) => value || 'N/A'
                    },
                    {
                        key: "company",
                        label: "Company",
                        render: (value) => value || 'N/A'
                    },
                    {
                        key: "subject",
                        label: "Subject",
                        render: (value) => value || 'N/A'
                    },
                    {
                        key: "message",
                        label: "Message",
                        render: (value) => value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : 'N/A'
                    },
                    {
                        key: "interest_of_services",
                        label: "Interest of Services",
                        render: (value) => value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : 'N/A'
                    },
                    statusHeader,
                    ...commonHeaders
                ];
        }
    };

    const headers = getHeadersByFormType();

    useEffect(() => {
        if (!queryValue) {
            navigate("/")
            return
        }
    }, [queryValue, navigate])

    return (
        <>
            <Row>
                <Col md="3" className="mb-2">
                    <Input
                        type="text"
                        name="search"
                        autoComplete="new-search"
                        placeholder='Search by name, email...'
                        onChange={handleSearch}
                        value={searchFilter?.search}
                    />
                </Col>
                <Col md="2" className="mb-2">
                    <Input
                        type="select"
                        name="status"
                        value={searchFilter?.status}
                        onChange={handleSearch}
                    >
                        <option value="">All Status</option>
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                    </Input>
                </Col>
                <Col md={2}>
                    <Button type="click" onClick={handleResetFilter} className="reset-button">
                        <BiReset />Reset
                    </Button>
                </Col>
            </Row>

            {
                isQueryLoad ? <Loader /> : queryList?.data?.length == 0 ? <NoDataFound msg={"No Form Queries Found"} /> : <>
                    <TableView headers={headers} data={queryList?.data} showActions={true} renderActions={renderActions} />

                    <Pagination
                        pagination={queryList?.pagination}
                    />
                </>
            }
        </>
    )
}

export default FormQueryList