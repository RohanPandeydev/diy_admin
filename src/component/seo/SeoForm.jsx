import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap'
import { useFormik } from 'formik'
import { BlogFormValidation, SeoFormValidation } from '../../helper/ValidationHelper/Validation'
import validateFileImage from '../../utils/ValidationImage'
import Editor from '../../utils/Editor'
import Swal from 'sweetalert2'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import BlogServices from '../../services/BlogServices'
import slugify from "slugify";
import ButtonLoader from '../../utils/Loader/ButtonLoader'
import { useNavigate, useParams } from 'react-router-dom'
import { useCustomQuery } from '../../utils/QueryHooks'
import config from '../../../config'
import CategoryServices from '../../services/CategoryServices'
import { buildQueryString } from '../../utils/BuildQuery'

const SeoForm = ({ title }) => {
    const { slug, parentslug } = useParams()
    const [decodeSlug, setDecodeSlug] = useState(false)


    const queryClient = useQueryClient()
    const navigate = useNavigate()


    function generateStructuredData(values) {
        return JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": values.metaTitle || values.title,
            "description": values.metaDescription || "",
            "author": {
                "@type": "Person",
                "name": "Your Name or Brand"
            },
            "datePublished": new Date().toISOString(),  // You can customize this
            "image": values.ogImage || "",              // Use cover image or OG image
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://yourdomain.com/blog/${values.slug}`  // Replace with your domain
            }
        }, null, 2);
    }





    const initialValues = {
        title: "",               // Title tag (shown in search engine results and browser tab)
        slug: "",                // URL-friendly version of the title
        metaTitle: "",           // Meta title (optional, can differ from title for better targeting)
        metaDescription: "",     // Meta description (concise summary for search engines)
        metaKeywords: "",        // (Optional) Keywords for internal search or legacy support
        canonicalUrl: "",        // Canonical URL to avoid duplicate content issues
        ogTitle: "",             // Open Graph title (used by social platforms like Facebook)
        ogDescription: "",       // Open Graph description
        ogImage: "",             // OG image to display when page is shared
        ogType: "website",       // Type of content (website, article, etc.)
        robots: "index, follow", // Tells search engines to index and follow links
        // Optional Scripts
        customHeadScripts: "",
        customFooterScripts: "",
        googleCSEId: "",
    };

    const formik = useFormik({
        initialValues,
        validationSchema: SeoFormValidation,
        onSubmit: (values) => {
            submitHandler(values);
        }
    });



    const submitHandler = (data) => {
        const structureData = generateStructuredData(data)
        console.log("Form Submitted:", data, structureData);

    };


    const mutation = useMutation(
        (formdata) => BlogServices.addBlog(formdata),

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


                Swal.fire({
                    title: "Successful",
                    text: "Blog created  Successfully",
                    icon: "success",
                });
                formik.resetForm()
                setCoverImg(false)
                setCoverImgErr("")
                setShowCoverImg(false)
                navigate("/blog/" + btoa(data?.data?.data?.slug))


                queryClient.refetchQueries(["blog-details", data?.data?.data?.slug])
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
    const updatemutation = useMutation(
        (formdata) => BlogServices.updateBlogBySlug(formdata),

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


                Swal.fire({
                    title: "Successful",
                    text: "Blog updated  Successfully",
                    icon: "success",
                });
                formik.resetForm()
                setCoverImg(false)
                setCoverImgErr("")
                setShowCoverImg(false)
                navigate("/blog/" + btoa(decodeSlug))


                queryClient.refetchQueries(["blog-details", decodeSlug])
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

    console.log(formik.errors)




    // Get By Slug
    const {
        data,
        isLoading,
    } = useCustomQuery({
        queryKey: ['category-details', decodeSlug],
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








    useEffect(() => {
        if (formik.values.title) {
            const generatedSlug = slugify(formik.values.title, {
                lower: true,
                strict: true,
            });
            formik.setFieldValue("slug", generatedSlug);
        }
    }, [formik.values.title]);




    useEffect(() => {
        try {
            const decodeSlug = slug && atob(slug);
            console.log("decodeSlug", !!slug, slug);

            slug && setDecodeSlug(() => decodeSlug || "");
        } catch (error) {
            // console.error("Error decoding user ID:", error.message);
            // Handle the error gracefully, e.g., display an error message to the user
            navigate(-1)
        }
    }, [slug]);









    // State to hold the custom script fields
    const [customHeadscripts, setCustomHeadScripts] = useState([""]); // Initially, one empty script field

    // Handle adding a new field
    const handleCustomHeadScriptAddField = () => {
        if (customHeadscripts?.length == 5) return
        setCustomHeadScripts([...customHeadscripts, ""]);
    };

    // Handle deleting a specific field
    const handleCustomHeadDeleteField = (index) => {
        const updatedScripts = customHeadscripts.filter((_, i) => i !== index);
        setCustomHeadScripts(updatedScripts);
    };

    // Handle script change for a specific index
    const handleCustomHeadScriptChange = (event, index) => {
        const updatedScripts = [...customHeadscripts];
        updatedScripts[index] = event.target.value;
        setCustomHeadScripts(updatedScripts);
    };










    return (
        <>
            <h1>{title}</h1>

            <Form onSubmit={formik.handleSubmit}>
                <Row>
                    {/* Title */}
                    <Col md="6" className="mb-2">
                        <FormGroup className="common-formgroup">
                            <Label>Title</Label>
                            <Input
                                type="text"
                                {...formik.getFieldProps("title")}
                                autoComplete="new-title"
                                className={formik.touched.title && formik.errors.title ? "is-invalid" : ""}
                            />
                            {formik.touched.title && <p className="text-danger">{formik.errors.title}</p>}
                        </FormGroup>
                    </Col>

                    {/* Slug */}
                    <Col md="6" className="mb-2">
                        <FormGroup className="common-formgroup">
                            <Label>Slug *</Label>
                            <Input
                                type="text"
                                {...formik.getFieldProps("slug")}
                                autoComplete="new-slug"
                                className={formik.touched.slug && formik.errors.slug ? "is-invalid" : ""}
                            />
                            {formik.touched.slug && <p className="text-danger">{formik.errors.slug}</p>}
                        </FormGroup>
                    </Col>

                    {/* SEO Meta Title */}
                    <Col md="6" className="mb-2">
                        <FormGroup className="common-formgroup">
                            <Label>Meta Title</Label>
                            <Input
                                type="text"
                                name="metaTitle"
                                {...formik.getFieldProps("metaTitle")}
                                autoComplete="new-metaTitle"
                                className={formik.touched.metaTitle && formik.errors.metaTitle ? "is-invalid" : ""}
                            />
                            {formik.touched.metaTitle && <p className="text-danger">{formik.errors.metaTitle}</p>}
                        </FormGroup>
                    </Col>

                    {/* SEO Meta Description */}
                    <Col md="12" className="mb-2">
                        <FormGroup className="common-formgroup">
                            <Label>Meta Description</Label>
                            <Input
                                type="textarea"
                                {...formik.getFieldProps("metaDescription")}
                                autoComplete="new-metaDescription"
                                className={formik.touched.metaDescription && formik.errors.metaDescription ? "is-invalid" : ""}
                                rows={3}
                            />
                            {formik.touched.metaDescription && <p className="text-danger">{formik.errors.metaDescription}</p>}
                        </FormGroup>
                    </Col>

                    {/* Canonical URL */}
                    <Col md="6" className="mb-2">
                        <FormGroup className="common-formgroup">
                            <Label>Canonical URL</Label>
                            <Input
                                type="text"
                                {...formik.getFieldProps("canonicalUrl")}
                                autoComplete="new-canonicalUrl"
                                className={formik.touched.canonicalUrl && formik.errors.canonicalUrl ? "is-invalid" : ""}
                            />
                            {formik.touched.canonicalUrl && <p className="text-danger">{formik.errors.canonicalUrl}</p>}
                        </FormGroup>
                    </Col>

                    {/* Meta Keywords (Optional) */}
                    <Col md="6" className="mb-2">
                        <FormGroup className="common-formgroup">
                            <Label>Meta Keywords (comma separated)</Label>
                            <Input
                                type="text"
                                {...formik.getFieldProps("metaKeywords")}
                                autoComplete="new-metaKeywords"
                                className={formik.touched.metaKeywords && formik.errors.metaKeywords ? "is-invalid" : ""}
                            />
                            {formik.touched.metaKeywords && <p className="text-danger">{formik.errors.metaKeywords}</p>}
                        </FormGroup>
                    </Col>

                    {/* Robots */}
                    <Col md="6" className="mb-2">
                        <FormGroup className="common-formgroup">
                            <Label>Robots Meta Tag</Label>
                            <Input
                                type="select"
                                {...formik.getFieldProps("robots")}
                                className={formik.touched.robots && formik.errors.robots ? "is-invalid" : ""}
                            >
                                <option value="index, follow">Index, Follow</option>
                                <option value="noindex, follow">No Index, Follow</option>
                                <option value="index, nofollow">Index, No Follow</option>
                                <option value="noindex, nofollow">No Index, No Follow</option>
                            </Input>
                            {formik.touched.robots && <p className="text-danger">{formik.errors.robots}</p>}
                        </FormGroup>
                    </Col>

                    {/* Open Graph Title */}
                    <Col md="6" className="mb-2">
                        <FormGroup className="common-formgroup">
                            <Label>Open Graph Title</Label>
                            <Input
                                type="text"
                                {...formik.getFieldProps("ogTitle")}
                                autoComplete="new-ogTitle"
                                className={formik.touched.ogTitle && formik.errors.ogTitle ? "is-invalid" : ""}
                            />
                            {formik.touched.ogTitle && <p className="text-danger">{formik.errors.ogTitle}</p>}
                        </FormGroup>
                    </Col>

                    {/* Open Graph Description */}
                    <Col md="12" className="mb-2">
                        <FormGroup className="common-formgroup">
                            <Label>Open Graph Description</Label>
                            <Input
                                type="textarea"
                                {...formik.getFieldProps("ogDescription")}
                                autoComplete="new-ogDescription"
                                className={formik.touched.ogDescription && formik.errors.ogDescription ? "is-invalid" : ""}
                                rows={3}
                            />
                            {formik.touched.ogDescription && <p className="text-danger">{formik.errors.ogDescription}</p>}
                        </FormGroup>
                    </Col>

                    {/* Open Graph Image URL */}
                    <Col md="6" className="mb-2">
                        <FormGroup className="common-formgroup">
                            <Label>Open Graph Image URL</Label>
                            <Input
                                type="text"
                                {...formik.getFieldProps("ogImage")}
                                autoComplete="new-ogImage"
                                className={formik.touched.ogImage && formik.errors.ogImage ? "is-invalid" : ""}
                            />
                            {formik.touched.ogImage && <p className="text-danger">{formik.errors.ogImage}</p>}
                        </FormGroup>
                    </Col>

                    {/* Open Graph Type */}
                    <Col md="6" className="mb-2">
                        <FormGroup className="common-formgroup">
                            <Label>Open Graph Type</Label>
                            <Input
                                type="select"
                                {...formik.getFieldProps("ogType")}
                                className={formik.touched.ogType && formik.errors.ogType ? "is-invalid" : ""}
                            >
                                <option value="website">Website</option>
                                <option value="article">Article</option>
                                <option value="video">Video</option>
                            </Input>
                            {formik.touched.ogType && <p className="text-danger">{formik.errors.ogType}</p>}
                        </FormGroup>
                    </Col>

                    {/* Custom Scripts */}
                    <Col md="6" className="mb-2">
                        <FormGroup className="common-formgroup">
                            <Label>Custom Head Scripts</Label>
                            <Input
                                type="textarea"
                                {...formik.getFieldProps("customHeadScripts")}
                                autoComplete="new-customHeadScripts"
                                className={formik.touched.customHeadScripts && formik.errors.customHeadScripts ? "is-invalid" : ""}
                                rows={3}
                            />
                            {formik.touched.customHeadScripts && <p className="text-danger">{formik.errors.customHeadScripts}</p>}
                        </FormGroup>
                    </Col>



                    <Row>
                        {/* Render each script field dynamically */}
                        {customHeadscripts.map((script, index) => (
                            <Col md="6" className="mb-2" key={index}>
                                <FormGroup className="common-formgroup">
                                    <Label>Custom Head Script {index + 1}</Label>
                                    <Input
                                        type="textarea"
                                        value={script}
                                        onChange={(event) => handleCustomHeadScriptChange(event, index)}
                                        autoComplete={`new-customScript${index}`}
                                        className=""
                                        rows={3}
                                    />
                                    {/* Delete button for each script field */}
                                    {customHeadscripts?.length == 1 ? null : <Button
                                        type="button"
                                        color="danger"
                                        onClick={() => handleCustomHeadDeleteField(index)}
                                        className="mt-2"
                                    >
                                        Delete
                                    </Button>}
                                </FormGroup>
                            </Col>
                        ))}

                        {/* Add button to add a new script field */}
                        {customHeadscripts?.length > 4 ? null : <Col md="12">
                            <Button
                                type="button"
                                color="primary"
                                onClick={handleCustomHeadScriptAddField}
                                className="mt-2"
                            >
                                Add Script
                            </Button>
                        </Col>}
                    </Row>










                    {/* Custom Footer Scripts */}
                    {/* <Col md="6" className="mb-2">
                        <FormGroup className="common-formgroup">
                            <Label>Custom Footer Scripts</Label>
                            <Input
                                type="textarea"
                                {...formik.getFieldProps("customFooterScripts")}
                                autoComplete="new-customFooterScripts"
                                className={formik.touched.customFooterScripts && formik.errors.customFooterScripts ? "is-invalid" : ""}
                                rows={3}
                            />
                            {formik.touched.customFooterScripts && <p className="text-danger">{formik.errors.customFooterScripts}</p>}
                        </FormGroup>
                    </Col> */}






                    {/* Google CSE ID */}
                    <Col md="6" className="mb-2">
                        <FormGroup className="common-formgroup">
                            <Label>Google CSE ID</Label>
                            <Input
                                type="text"
                                {...formik.getFieldProps("googleCSEId")}
                                autoComplete="new-googleCSEId"
                                className={formik.touched.googleCSEId && formik.errors.googleCSEId ? "is-invalid" : ""}
                            />
                            {formik.touched.googleCSEId && <p className="text-danger">{formik.errors.googleCSEId}</p>}
                        </FormGroup>
                    </Col>

                    {/* Submit */}
                    <Col md="12">
                        <FormGroup>
                            <Button
                                className="btn btn-style1 px-4 py-2"
                                type="submit"
                                disabled={mutation?.isLoading || updatemutation?.isLoading}
                            >
                                {mutation.isLoading || updatemutation?.isLoading ? <ButtonLoader /> : 'Save'}
                            </Button>
                        </FormGroup>
                    </Col>
                </Row>
            </Form>

        </>
    );
};

export default SeoForm;
