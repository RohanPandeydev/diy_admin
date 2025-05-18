import { useState } from 'react'
import TableView from '../../utils/TableView'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { buildQueryString } from '../../utils/BuildQuery';
import Pagination from '../../utils/Pagination';
import { useCustomQuery } from '../../utils/QueryHooks';
import Loader from '../../utils/Loader/Loader';
import NoDataFound from '../../utils/NoDataFound';
import { Button, Col, Input, Row } from 'reactstrap';
import Swal from 'sweetalert2';
import ButtonLoader from '../../utils/Loader/ButtonLoader';
import StaffServices from '../../services/StaffServices';
import useCustomContext from '../../contexts/Context';
import { ProtectedMethod } from '../../guard/RBACGuard';

const StaffList = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [limit] = useState(10)
    const queryClient = useQueryClient()
    const [rowId, setRowId] = useState("")
    const { adminId } = useCustomContext()

    const [searchFilter, setSearchFilter] = useState({
        search: "",
    })


    // Get page from URL, default to 1
    const currentPage = parseInt(searchParams.get('page') || '1');

    const {
        data: staffList,
        isLoading: isStaffLoad,
    } = useCustomQuery({
        queryKey: ['staff-list', currentPage, searchFilter],
        service: StaffServices.staffList,
        params: buildQueryString([{
            key: "page", value: currentPage || 1,
        }, {
            key: "limit", value: limit || 10
        },
        {
            key: "search", value: searchFilter?.search
        },
        {
            key: "reporting_to", value: adminId
        },



        ]),
        enabled: !!adminId,
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


        })
        // Update search parameters
        searchParams.set('page', '1'); // Reset page to 1 on filter change

        // Navigate to new URL with updated search params
        navigate(`${location.pathname}?${searchParams.toString()}`);
    }





    const handleSoftDelete = (row) => {

        Swal.fire({
            title: "Are you sure?",
            text: "This staff will be deleted.",
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
            <NavLink to={`/management/staff/${btoa(row.id)}`}>
                <Button color="info" size="sm" className="me-2">View</Button>
            </NavLink>
            <ProtectedMethod moduleName={"staff"} action='update'>

                <NavLink to={`/management/staff/update/${btoa(row.id)}`}>
                    <Button color="primary" size="sm">Edit</Button>
                </NavLink>
            </ProtectedMethod>

            <ProtectedMethod moduleName={"blog"} action='delete'>
                <Button color="danger" className='mx-2' size="sm" disabled={row.id == rowId || deletemutation?.isLoading} onClick={() => handleSoftDelete(row)}>{row.id == rowId || deletemutation?.isLoading ? <ButtonLoader /> : "Delete"}</Button>
            </ProtectedMethod>
        </>
    )

    const deletemutation = useMutation(
        (formdata) => StaffServices.softDeleteStaff(formdata),
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
                    text: "Staff deleted  Successfully",
                    icon: "success",
                });



                queryClient.refetchQueries(["staff-list", currentPage])
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
            key: "first_name",
            label: "First Name"

        },
        {
            key: "last_name",
            label: "Last Name"

        },
        {
            key: "email",
            label: "Email"

        },
        {
            key: "designation",
            label: "Designation"

        },



        {
            key: "Action",
            label: "",
            isAction: true

        },

    ]
    return (
        <>
            <Row>
                <Col md="6" className="mb-2">
                    <Input
                        type="text"
                        name="search"
                        autoComplete="new-slug"
                        placeholder='Search...'
                        onChange={handleSearch}
                        value={searchFilter?.search}
                    />

                </Col>



                <Button type="click" onClick={handleResetFilter}>Reset</Button>
            </Row>

            {
                isStaffLoad ? <Loader /> : staffList?.data?.length == 0 ? <NoDataFound msg={"No Staff Found"} /> : <>
                    <TableView headers={headers} data={staffList?.data} showActions={true} renderActions={renderActions} />

                    <Pagination
                        pagination={staffList?.pagination}
                    />

                </>
            }

        </>
    )
}

export default StaffList