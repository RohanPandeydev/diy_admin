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
import { useNavigate } from 'react-router-dom'
import CategoryServices from '../../services/CategoryServices'
import { buildQueryString } from '../../utils/BuildQuery'
import NoDataFound from '../../utils/NoDataFound'

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
                            </Col>
                        })
                    }



                </Row>
            }






        </>
    )
}

export default SeoDetail