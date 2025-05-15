import React, { useEffect, useMemo, useState } from 'react'
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap'
import { useFormik } from 'formik'
import { SeoFormValidation } from '../../helper/ValidationHelper/Validation'
import Swal from 'sweetalert2'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import slugify from "slugify";
import ButtonLoader from '../../utils/Loader/ButtonLoader'
import { useNavigate, useParams } from 'react-router-dom'
import { useCustomQuery } from '../../utils/QueryHooks'
import SeoServices from '../../services/SeoServices'
import Loader from '../../utils/Loader/Loader'
import { validateOgFileImage } from '../../utils/ValidationImage'
import config from '../../../config'
import { useRef } from 'react'

const SeoForm = ({ title }) => {
    let { parentslug, childslug, gslug } = useParams()
    const [isSlugAdded, setIsSlugAdded] = useState(false)

    const allowedExtensionsImage = [".jpg", ".jpeg", ".png"]
    const [ogImg, setOgImg] = useState(null);
    const [showOgImg, setShowOgImg] = useState(null);
    const [ogImgErr, setOgImgErr] = useState("");

    const fileOgImgRef = useRef(null);

    const queryClient = useQueryClient()
    const navigate = useNavigate()


    const handleAppendComma = (e) => {
        const inputElement = document.getElementById("metaKeywordsInput");
        const selectedText = inputElement.value.slice(inputElement.selectionStart, inputElement.selectionEnd);

        if (selectedText === inputElement.value) {
            // If the whole text is selected, replace spaces with commas
            const newValue = inputElement.value.replace(/\s+/g, ',');
            formik.setFieldValue("metaKeywords", newValue);
        } else {
            // If not, just append a comma at the end
            const currentValue = formik.values.metaKeywords;
            formik.setFieldValue("metaKeywords", currentValue + ",");
        }

        // Retain focus on the input field
        inputElement.focus();
    }

    const handleAppendScriptTag = (e, tag, index, customOnChange) => {
        const inputElement = document.getElementById(`${tag}${index}`);
        const originalValue = inputElement.value;

        // Remove any existing <script>...</script> tag
        const valueWithoutScript = originalValue.replace(/<script>[\s\S]*?<\/script>/gi, "");

        const selectionStart = inputElement.selectionStart;
        const selectionEnd = inputElement.selectionEnd;

        const selectedText = valueWithoutScript.slice(selectionStart, selectionEnd);

        let newScript = "";

        if (selectedText) {
            // Wrap selected text with <script> tags
            newScript = valueWithoutScript.slice(0, selectionStart) +
                `<script>${selectedText}</script>` +
                valueWithoutScript.slice(selectionEnd);
        } else {
            // Append empty <script> tag at the end
            newScript = valueWithoutScript + "<script></script>";
        }

        // Update input value
        customOnChange({ target: { value: newScript } }, index);

        // Retain focus on the input field
        inputElement.focus();
    };


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




    const handleOgImage = async (e) => {
        const file = e?.target?.files?.[0];
        if (!file) return;

        // const isFileValid = await validateOgFileImage(file, 2, allowedExtensionsImage);
        // console.log(validateOgFileImage, "validateOgFileImage")
        // if (!isFileValid?.isValid) {
        //     setOgImgErr(isFileValid?.errorMessage);
        //     return;
        // }

        setOgImg(file);
        setShowOgImg(URL.createObjectURL(file));
        setOgImgErr("");
    };


    const initialValues = {
        title: "",               // Title tag (shown in search engine results and browser tab)
        slug: "",                // URL-friendly version of the title
        metaTitle: "",           // Meta title (optional, can differ from title for better targeting)
        metaDescription: "",     // Meta description (concise summary for search engines)
        metaKeywords: "",        // (Optional) Keywords for internal search or legacy support
        canonicalUrl: "",        // Canonical URL to avoid duplicate content issues
        ogTitle: "",             // Open Graph title (used by social platforms like Facebook)
        ogDescription: "",       // Open Graph description
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



    const slugToCall = useMemo(() => {

        return gslug ? gslug : childslug ? childslug : parentslug


    }, [parentslug, childslug, gslug])










    const handleRefetch = (slug) => {
        queryClient.refetchQueries("parent-category-list")
        queryClient.refetchQueries(["category-list", 1])
        queryClient.refetchQueries(["category-details", slug])
        queryClient.refetchQueries(["seo-details-by-slug", slug])

    }

    const submitHandler = (data) => {
        const structureData = generateStructuredData(data)

        const formData = new FormData()

        formData.append("title", data?.title)
        formData.append("slug", data?.slug)
        formData.append("meta_title", data?.metaTitle)
        formData.append("meta_description", data?.metaDescription)
        formData.append("meta_keywords", data?.metaKeywords)
        formData.append("canonical_url", data?.canonicalUrl)
        formData.append("og_title", data?.ogTitle)
        formData.append("og_description", data?.ogDescription)
        formData.append("og_type", data?.ogType)
        formData.append("custom_head_scripts", data?.customHeadScripts)
        formData.append("custom_footer_scripts", data?.customFooterScripts)
        formData.append("google_cseid", data?.googleCSEId)
        formData.append("json_ld", JSON.stringify(structureData))
        if (ogImg) {
            formData.append("og_image", ogImg)
        }
        if (isSlugAdded) {
            formData.append("slugId", slugToCall)

            updatemutation.mutate(formData)

            return
        }
        formData.append("category_slug", slugToCall)


        mutation.mutate(formData)
    };


    const mutation = useMutation(
        (formdata) => SeoServices.addSeo(formdata),

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
                    text: "Seo Added  Successfully",
                    icon: "success",
                });
                formik.resetForm()
                setOgImg(false)
                setOgImgErr("")
                setShowOgImg(false)
                formik.resetForm()
                handleRefetch(data?.data?.data?.slug)


                if (slugToCall === parentslug) {
                    parentslug = data?.data?.data?.slug;
                }
                if (slugToCall === childslug) {
                    childslug = data?.data?.data?.slug;
                }
                if (slugToCall === gslug) {
                    gslug = data?.data?.data?.slug;
                }

                // Construct the path based on the updated slugs
                const path = `/seo${parentslug ? `/${parentslug}` : ""}${childslug ? `/${childslug}` : ""}${gslug ? `/${gslug}` : ""}/details`;

                // Navigate to the constructed path
                navigate(path);









                // queryClient.refetchQueries(["seo-details", data?.data?.data?.slug])
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
        (formdata) => SeoServices.updateSeoBySlug(formdata),

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
                    text: "Seo updated  Successfully",
                    icon: "success",
                });
                formik.resetForm()
                setOgImg(false)
                setOgImgErr("")
                setShowOgImg(false)
                console.log(data, "datadatadata")

                // navigate("/blog/" + btoa(slugToCall))

                formik.resetForm()
                handleRefetch(data?.data?.data?.slug)
                if (slugToCall === parentslug) {
                    parentslug = data?.data?.data?.slug;
                }
                if (slugToCall === childslug) {
                    childslug = data?.data?.data?.slug;
                }
                if (slugToCall === gslug) {
                    gslug = data?.data?.data?.slug;
                }

                // Construct the path based on the updated slugs
                const path = `/seo${parentslug ? `/${parentslug}` : ""}${childslug ? `/${childslug}` : ""}${gslug ? `/${gslug}` : ""}/details`;

                // Navigate to the constructed path
                navigate(path);
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





    // Get By Slug
    const {
        data,
        isLoading,
    } = useCustomQuery({
        queryKey: ['seo-details-by-slug', slugToCall, gslug, childslug, parentslug],
        service: SeoServices.seoBySlug,
        params: { slug: slugToCall },
        enabled: !!slugToCall,
        staleTime: 0,
        onSuccess: (data) => {
            // console.log(data, "titletitle")
            if (!data?.status) {
                // Swal.fire({
                //     title: "Error",
                //     text: data?.message,
                //     icon: "error",

                // });
                setIsSlugAdded(false)


                return
            }

            formik.setFieldValue("title", data?.data?.title || "")
            formik.setFieldValue("slug", data?.data?.slug || "")
            formik.setFieldValue("metaTitle", data?.data?.meta_title || "")
            formik.setFieldValue("metaDescription", data?.data?.meta_description || "")
            formik.setFieldValue("metaKeywords", data?.data?.meta_keywords || "")
            formik.setFieldValue("canonicalUrl", data?.data?.canonical_url || "")
            formik.setFieldValue("ogTitle", data?.data?.og_title || "")
            formik.setFieldValue("ogDescription", data?.data?.og_description || "")
            formik.setFieldValue("ogType", data?.data?.og_type || "")
            formik.setFieldValue("robots", data?.data?.robots || "")
            formik.setFieldValue("googleCSEId", data?.data?.google_cseid || "")
            if (data?.data?.custom_head_scripts?.length) {
                const parse = JSON.parse(data?.data?.custom_head_scripts)
                if (parse?.length) {
                    formik.setFieldValue("customHeadScripts", JSON.stringify(parse))
                    setCustomHeadScripts(parse)

                }
            }
            if (data?.data?.custom_footer_scripts?.length) {
                const parse = JSON.parse(data?.data?.custom_footer_scripts)
                if (parse?.length) {
                    formik.setFieldValue("customFooterScripts", JSON.stringify(parse))
                    setCustomFooterScripts(parse)

                }
            }
            if (data?.data?.og_image) {


                setShowOgImg(config.apiUrl + "/" + data?.data?.og_image)
            }

            setIsSlugAdded(true)

        },
        select: (data) => {
            // if (!data?.data?.status) {
            //     Swal.fire({
            //         title: "Error",
            //         text: data?.data?.message,
            //         icon: "error",

            //     });


            //     return
            // }

            return data?.data;
        },

        errorMsg: "",

    });









    useEffect(() => {
        if (slugToCall && !isLoading && !data?.status) {
            formik.setFieldValue("title", slugToCall);
            formik.setFieldValue("slug", slugToCall);

        }
    }, [slugToCall, isLoading, data])











    // State to hold the custom script fields
    const [customHeadscripts, setCustomHeadScripts] = useState([""]); // Initially, one empty script field
    const [customFooterscripts, setCustomFooterScripts] = useState([""]); // Initially, one empty script field

    // Handle adding a new field
    const handleCustomHeadScriptAddField = () => {
        if (customHeadscripts?.length == 5) return
        setCustomHeadScripts([...customHeadscripts, ""]);
    };
    // Handle adding a new field
    const handleCustomFooterScriptAddField = () => {
        if (customHeadscripts?.length == 5) return
        setCustomFooterScripts([...customFooterscripts, ""]);
    };

    // Handle deleting a specific field
    const handleCustomHeadDeleteField = (index) => {
        const updatedScripts = customHeadscripts.filter((_, i) => i !== index);
        setCustomHeadScripts(updatedScripts);
    };
    // Handle deleting a specific field
    const handleCustomFooterDeleteField = (index) => {
        const updatedScripts = customFooterscripts.filter((_, i) => i !== index);
        setCustomFooterScripts(updatedScripts);
    };

    // Handle script change for a specific index
    const handleCustomHeadScriptChange = (event, index) => {
        const updatedScripts = [...customHeadscripts];
        updatedScripts[index] = event.target.value;

        formik.setFieldValue("customHeadScripts", JSON.stringify(updatedScripts))
        setCustomHeadScripts(updatedScripts);
    };

    // Handle script change for a specific index
    const handleCustomFooterScriptChange = (event, index) => {
        const updatedScripts = [...customFooterscripts];
        updatedScripts[index] = event.target.value;
        formik.setFieldValue("customFooterScripts", JSON.stringify(updatedScripts))

        setCustomFooterScripts(updatedScripts);
    };









    return (
        <>
            {
                isLoading ? <Loader /> : <>
                    <h1>{data?.status ? "UPDATE " + title : "Add " + title}</h1>

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
                                    <Label>
                                        Meta Keywords (comma separated)
                                        {formik.values?.metaKeywords?.length > 0 && (
                                            <small
                                                className="text-primary"
                                                onClick={handleAppendComma}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                &nbsp; Add comma
                                            </small>
                                        )}
                                    </Label>
                                    <Input
                                        type="text"
                                        {...formik.getFieldProps("metaKeywords")}
                                        autoComplete="new-metaKeywords"
                                        id="metaKeywordsInput"
                                        className={formik.touched.metaKeywords && formik.errors.metaKeywords ? "is-invalid" : ""}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.metaKeywords && formik.errors.metaKeywords && (
                                        <p className="text-danger">{formik.errors.metaKeywords}</p>
                                    )}
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

                            {/* Open Graph Image URL
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
                            </Col> */}

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
                            <Col md="6" className="mb-2">
                                <FormGroup className="common-formgroup">
                                    <Label>
                                        Open Graph Image                                       <br />
                                        <small className="text-muted">
                                            (Accepted: JPG, JPEG, PNG &nbsp;|&nbsp; Max size: 2MB &nbsp;|&nbsp; Min dimensions: 1200x630px &nbsp;|&nbsp; Aspect ratio: ~1.91:1)
                                        </small>
                                    </Label>
                                    <Input
                                        type="file"
                                        name="og_image"
                                        accept={allowedExtensionsImage}
                                        onChange={handleOgImage}
                                        innerRef={fileOgImgRef}
                                        autoComplete="new-og_image"
                                        className={ogImgErr ? "is-invalid" : ""}
                                    />
                                    {ogImgErr && <p className="text-danger">{ogImgErr}</p>}
                                    {showOgImg && (
                                        <div className="upload-review mt-2">
                                            <img
                                                src={showOgImg}
                                                alt="Cover Preview"
                                                className="img-fluid"
                                                height={100}
                                                width={100}
                                                style={{ objectFit: "cover", borderRadius: "4px" }}
                                            />
                                        </div>
                                    )}
                                </FormGroup>
                            </Col>





                            <Row>
                                {/* Render each script field dynamically */}
                                {customHeadscripts.map((script, index) => (
                                    <Col md="6" className="mb-2" key={index}>
                                        <FormGroup className="common-formgroup">
                                            <Label>Custom Head Script {index + 1}</Label>

                                            <small
                                                className="text-primary"
                                                onClick={(e) => handleAppendScriptTag(e, "customHeadScriptInput", index, handleCustomHeadScriptChange)}
                                                style={{ cursor: 'pointer', display: 'inline-block', marginTop: '5px' }}
                                            >
                                                Script tag
                                            </small>                                            <Input
                                                type="textarea"
                                                value={script}
                                                onChange={(event) => handleCustomHeadScriptChange(event, index)}
                                                autoComplete={`new-customScript${index}`}
                                                className=""
                                                rows={3}
                                                id={`customHeadScriptInput${index}`}
                                            />
                                            {/* Add Script button */}

                                            {/* Delete button for each script field */}
                                            {customHeadscripts?.length === 1 ? null : (
                                                <Button
                                                    type="button"
                                                    color="danger"
                                                    onClick={() => handleCustomHeadDeleteField(index)}
                                                    className="mt-2"
                                                >
                                                    Delete
                                                </Button>
                                            )}
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
                            <Row>
                                {/* Render each script field dynamically */}
                                {customFooterscripts.map((script, index) => (
                                    <Col md="6" className="mb-2" key={index}>
                                        <FormGroup className="common-formgroup">
                                            <Label>Custom Footer Script {index + 1}</Label>
                                            <small
                                                className="text-primary"
                                                onClick={(e) => handleAppendScriptTag(e, "customFooterScriptInput", index, handleCustomFooterScriptChange)}
                                                style={{ cursor: 'pointer', display: 'inline-block', marginTop: '5px' }}
                                            >
                                                Script Tag
                                            </small>
                                            <Input
                                                type="textarea"
                                                value={script}
                                                onChange={(event) => handleCustomFooterScriptChange(event, index)}
                                                autoComplete={`new-customScript${index}`}
                                                className=""
                                                rows={3}
                                                id={`customFooterScriptInput${index}`}
                                            />

                                            {/* Delete button for each script field */}
                                            {customFooterscripts?.length == 1 ? null : <Button
                                                type="button"
                                                color="danger"
                                                onClick={() => handleCustomFooterDeleteField(index)}
                                                className="mt-2"
                                            >
                                                Delete
                                            </Button>}
                                        </FormGroup>
                                    </Col>
                                ))}

                                {/* Add button to add a new script field */}
                                {customFooterscripts?.length > 4 ? null : <Col md="12">
                                    <Button
                                        type="button"
                                        color="primary"
                                        onClick={handleCustomFooterScriptAddField}
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
            }
        </>
    );
};

export default SeoForm;
