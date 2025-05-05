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






        </>
    )
}

export default SeoDetail