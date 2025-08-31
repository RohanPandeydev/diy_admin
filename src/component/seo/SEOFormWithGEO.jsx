import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row, Card, CardBody } from 'reactstrap';
import { useFormik } from 'formik';
import Swal from 'sweetalert2';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import SeoServices from '../../services/SeoServices';
import ButtonLoader from '../../utils/Loader/ButtonLoader';
import { useNavigate, useParams } from 'react-router-dom';
import { useCustomQuery } from '../../utils/QueryHooks';
import config from '../../../config';
import CategoryServices from '../../services/CategoryServices';
import { buildQueryString } from '../../utils/BuildQuery';
import AsyncSelect from 'react-select/async';
import FAQSection from '../blog/FAQSection';
import EntitiesKeywords from '../blog/EntitiesKeywords';

const SEOFormWithGEO = ({ title, isEdit = false }) => {
  const { slug } = useParams();
  const [decodeSlug, setDecodeSlug] = useState(false);
  const [ogImage, setOgImage] = useState(null);
  const [showOgImage, setShowOgImage] = useState(null);
  const [ogImageErr, setOgImageErr] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const fileOgImageRef = useRef(null);

  const allowedExtensionsImage = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

  const initialValues = {
    title: "",
    slug: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    canonical_url: "",
    og_title: "",
    og_description: "",
    og_type: "website",
    robots: "index, follow",
    custom_head_scripts: "",
    custom_footer_scripts: "",
    google_cseid: "",
    category_slug: "",
    category_name: "",
    // GEO fields
    ai_summary: "",
    faq_section: [],
    schema_type: "WebPage",
    entities_keywords: [],
    page_type: "custom"
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      submitHandler(values);
    }
  });

  const handleOgImage = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    // Basic file validation
    const maxSize = 5; // 5MB
    const fileSize = file.size / (1024 * 1024);
    
    if (fileSize > maxSize) {
      setOgImageErr(`File size must be less than ${maxSize}MB`);
      return;
    }

    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedExtensionsImage.includes(fileExtension)) {
      setOgImageErr(`Only ${allowedExtensionsImage.join(', ')} files are allowed`);
      return;
    }

    setOgImage(file);
    setShowOgImage(URL.createObjectURL(file));
    setOgImageErr("");
  };

  const submitHandler = (data) => {
    console.log("SEO Form Submitted:", data, ogImage);
    const formData = new FormData();
    
    // Basic SEO fields
    formData.append("title", data?.title);
    formData.append("slug", data?.slug);
    formData.append("meta_title", data?.meta_title);
    formData.append("meta_description", data?.meta_description);
    formData.append("meta_keywords", data?.meta_keywords);
    formData.append("canonical_url", data?.canonical_url);
    formData.append("og_title", data?.og_title);
    formData.append("og_description", data?.og_description);
    formData.append("og_type", data?.og_type);
    formData.append("robots", data?.robots);
    formData.append("custom_head_scripts", data?.custom_head_scripts);
    formData.append("custom_footer_scripts", data?.custom_footer_scripts);
    formData.append("google_cseid", data?.google_cseid);
    formData.append("category_slug", data?.category_slug);
    
    // GEO fields
    if (data?.ai_summary) {
      formData.append("ai_summary", data?.ai_summary);
    }
    if (data?.faq_section && data?.faq_section.length > 0) {
      formData.append("faq_section", JSON.stringify(data?.faq_section));
    }
    if (data?.schema_type) {
      formData.append("schema_type", data?.schema_type);
    }
    if (data?.entities_keywords && data?.entities_keywords.length > 0) {
      formData.append("entities_keywords", JSON.stringify(data?.entities_keywords));
    }
    if (data?.page_type) {
      formData.append("page_type", data?.page_type);
    }
    
    if (ogImage) {
      formData.append("og_image", ogImage);
    }

    if (isEdit && decodeSlug) {
      formData.append("slugId", decodeSlug);
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const createMutation = useMutation(
    (formData) => SeoServices.createSEO(formData),
    {
      onSuccess: (data) => {
        if (!data?.data?.status) {
          Swal.fire({
            title: "Error",
            text: data?.data?.message,
            icon: "error",
          });
          return;
        }

        Swal.fire({
          title: "Success",
          text: "SEO entry created successfully",
          icon: "success",
        });
        
        formik.resetForm();
        setOgImage(null);
        setOgImageErr("");
        setShowOgImage(null);

        queryClient.refetchQueries(["seo-list"]);
        navigate("/cms/seo");
      },
      onError: (err) => {
        Swal.fire({
          title: "Error",
          text: err?.response?.data?.message || err?.message,
          icon: "error",
        });
      },
    }
  );

  const updateMutation = useMutation(
    (formData) => SeoServices.updateSEO(formData),
    {
      onSuccess: (data) => {
        if (!data?.data?.status) {
          Swal.fire({
            title: "Error",
            text: data?.data?.message,
            icon: "error",
          });
          return;
        }

        Swal.fire({
          title: "Success",
          text: "SEO entry updated successfully",
          icon: "success",
        });
        
        formik.resetForm();
        setOgImage(null);
        setOgImageErr("");
        setShowOgImage(null);

        queryClient.refetchQueries(["seo-list"]);
        navigate("/cms/seo");
      },
      onError: (err) => {
        Swal.fire({
          title: "Error",
          text: err?.response?.data?.message || err?.message,
          icon: "error",
        });
      },
    }
  );

  // Get SEO by Slug for editing
  const {
    data: seoData,
    isLoading,
  } = useCustomQuery({
    queryKey: ['seo-details', decodeSlug],
    service: SeoServices.getSEOBySlug,
    params: { slug: decodeSlug },
    enabled: !!decodeSlug && isEdit,
    staleTime: 0,
    select: (data) => {
      if (!data?.data?.status) {
        Swal.fire({
          title: "Error",
          text: data?.data?.message,
          icon: "error",
        });
        return;
      }
      return data?.data?.data;
    },
    onSuccess: (data) => {
      if (data) {
        formik.setFieldValue("title", data?.title || "");
        formik.setFieldValue("slug", data?.slug || "");
        formik.setFieldValue("meta_title", data?.meta_title || "");
        formik.setFieldValue("meta_description", data?.meta_description || "");
        formik.setFieldValue("meta_keywords", data?.meta_keywords || "");
        formik.setFieldValue("canonical_url", data?.canonical_url || "");
        formik.setFieldValue("og_title", data?.og_title || "");
        formik.setFieldValue("og_description", data?.og_description || "");
        formik.setFieldValue("og_type", data?.og_type || "website");
        formik.setFieldValue("robots", data?.robots || "index, follow");
        formik.setFieldValue("custom_head_scripts", data?.custom_head_scripts || "");
        formik.setFieldValue("custom_footer_scripts", data?.custom_footer_scripts || "");
        formik.setFieldValue("google_cseid", data?.google_cseid || "");
        
        // GEO fields
        formik.setFieldValue("ai_summary", data?.ai_summary || "");
        formik.setFieldValue("faq_section", data?.faq_section || []);
        formik.setFieldValue("schema_type", data?.schema_type || "WebPage");
        formik.setFieldValue("entities_keywords", data?.entities_keywords || []);
        formik.setFieldValue("page_type", data?.page_type || "custom");

        if (data?.category) {
          formik.setFieldValue("category_slug", data?.category?.slug || "");
          formik.setFieldValue("category_name", data?.category?.name || "");
        }

        if (data?.og_image) {
          setShowOgImage(config.apiUrl + "/" + data?.og_image);
        }
      }
    }
  });

  const handleSearchCategory = async (inputValue) => {
    try {
      const response = await CategoryServices.categoryList(buildQueryString([
        { key: "page", value: 1 },
        { key: "limit", value: 10 },
        { key: "search", value: inputValue }
      ]));

      return response?.data?.data?.map((category) => ({
        label: category.name,
        value: category.slug,
      })) || [];
    } catch (error) {
      console.error("Error fetching Category list:", error);
      return [];
    }
  };

  useEffect(() => {
    if (isEdit && slug) {
      try {
        const decodedSlug = atob(slug);
        setDecodeSlug(decodedSlug);
      } catch (error) {
        navigate(-1);
      }
    }
  }, [slug, isEdit, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>{title}</h1>

      <Form onSubmit={formik.handleSubmit}>
        <Row>
          {/* Basic SEO Information */}
          <Col md="12" className="mb-4">
            <Card>
              <CardBody>
                <h4 className="mb-3">Basic SEO Information</h4>
                
                <Row>
                  <Col md="6" className="mb-3">
                    <FormGroup>
                      <Label>Title *</Label>
                      <Input
                        type="text"
                        {...formik.getFieldProps("title")}
                        placeholder="Enter page title..."
                      />
                    </FormGroup>
                  </Col>
                  
                  <Col md="6" className="mb-3">
                    <FormGroup>
                      <Label>Slug *</Label>
                      <Input
                        type="text"
                        {...formik.getFieldProps("slug")}
                        placeholder="Enter URL slug..."
                      />
                    </FormGroup>
                  </Col>
                  
                  <Col md="6" className="mb-3">
                    <FormGroup>
                      <Label>Page Type</Label>
                      <Input
                        type="select"
                        {...formik.getFieldProps("page_type")}
                      >
                        <option value="custom">Custom Page</option>
                        <option value="home">Home Page</option>
                        <option value="about">About Page</option>
                        <option value="contact">Contact Page</option>
                        <option value="services">Services Page</option>
                        <option value="products">Products Page</option>
                        <option value="blog">Blog Page</option>
                        <option value="category">Category Page</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  
                  <Col md="6" className="mb-3">
                    <FormGroup>
                      <Label>Category</Label>
                      <AsyncSelect
                        cacheOptions
                        defaultOptions
                        loadOptions={handleSearchCategory}
                        placeholder="Search Category..."
                        value={
                          formik.values.category_slug
                            ? {
                              label: formik.values.category_name,
                              value: formik.values.category_slug,
                            }
                            : null
                        }
                        onChange={(selectedOption) => {
                          formik.setFieldValue('category_slug', selectedOption?.value || '');
                          formik.setFieldValue('category_name', selectedOption?.label || '');
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>

          {/* Meta Tags */}
          <Col md="12" className="mb-4">
            <Card>
              <CardBody>
                <h4 className="mb-3">Meta Tags</h4>
                
                <Row>
                  <Col md="6" className="mb-3">
                    <FormGroup>
                      <Label>Meta Title</Label>
                      <Input
                        type="text"
                        {...formik.getFieldProps("meta_title")}
                        placeholder="Enter meta title..."
                      />
                    </FormGroup>
                  </Col>
                  
                  <Col md="6" className="mb-3">
                    <FormGroup>
                      <Label>Meta Keywords</Label>
                      <Input
                        type="text"
                        {...formik.getFieldProps("meta_keywords")}
                        placeholder="Enter meta keywords..."
                      />
                    </FormGroup>
                  </Col>
                  
                  <Col md="12" className="mb-3">
                    <FormGroup>
                      <Label>Meta Description</Label>
                      <Input
                        type="textarea"
                        {...formik.getFieldProps("meta_description")}
                        placeholder="Enter meta description..."
                        rows="3"
                      />
                    </FormGroup>
                  </Col>
                  
                  <Col md="6" className="mb-3">
                    <FormGroup>
                      <Label>Canonical URL</Label>
                      <Input
                        type="url"
                        {...formik.getFieldProps("canonical_url")}
                        placeholder="Enter canonical URL..."
                      />
                    </FormGroup>
                  </Col>
                  
                  <Col md="6" className="mb-3">
                    <FormGroup>
                      <Label>Robots</Label>
                      <Input
                        type="select"
                        {...formik.getFieldProps("robots")}
                      >
                        <option value="index, follow">Index, Follow</option>
                        <option value="noindex, follow">No Index, Follow</option>
                        <option value="index, nofollow">Index, No Follow</option>
                        <option value="noindex, nofollow">No Index, No Follow</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>

          {/* Open Graph */}
          <Col md="12" className="mb-4">
            <Card>
              <CardBody>
                <h4 className="mb-3">Open Graph</h4>
                
                <Row>
                  <Col md="6" className="mb-3">
                    <FormGroup>
                      <Label>OG Title</Label>
                      <Input
                        type="text"
                        {...formik.getFieldProps("og_title")}
                        placeholder="Enter Open Graph title..."
                      />
                    </FormGroup>
                  </Col>
                  
                  <Col md="6" className="mb-3">
                    <FormGroup>
                      <Label>OG Type</Label>
                      <Input
                        type="select"
                        {...formik.getFieldProps("og_type")}
                      >
                        <option value="website">Website</option>
                        <option value="article">Article</option>
                        <option value="product">Product</option>
                        <option value="profile">Profile</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  
                  <Col md="12" className="mb-3">
                    <FormGroup>
                      <Label>OG Description</Label>
                      <Input
                        type="textarea"
                        {...formik.getFieldProps("og_description")}
                        placeholder="Enter Open Graph description..."
                        rows="3"
                      />
                    </FormGroup>
                  </Col>
                  
                  <Col md="12" className="mb-3">
                    <FormGroup>
                      <Label>OG Image (jpg/jpeg/png/gif/webp, max 5MB)</Label>
                      <Input
                        type="file"
                        name="og_image"
                        accept={allowedExtensionsImage.join(',')}
                        onChange={handleOgImage}
                        innerRef={fileOgImageRef}
                        className={ogImageErr ? "is-invalid" : ""}
                      />
                      {ogImageErr && <p className="text-danger">{ogImageErr}</p>}
                      {showOgImage && (
                        <div className="upload-review mt-2">
                          <img
                            src={showOgImage}
                            alt="OG Image Preview"
                            className="img-fluid"
                            height={100}
                            width={100}
                            style={{ objectFit: "cover", borderRadius: "4px" }}
                          />
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>

          {/* GEO Section */}
          <Col md="12" className="mb-4">
            <Card>
              <CardBody>
                <h4 className="mb-3">Generative Engine Optimization (GEO)</h4>
                
                <Row>
                  <Col md="12" className="mb-3">
                    <FormGroup>
                      <Label>AI Summary</Label>
                      <Input
                        type="textarea"
                        {...formik.getFieldProps("ai_summary")}
                        placeholder="Enter a short factual summary (1-2 sentences) for AI extraction..."
                        rows="3"
                      />
                      <small className="text-muted">
                        Provide a concise factual summary that AI can extract and use for search results.
                      </small>
                    </FormGroup>
                  </Col>
                  
                  <Col md="6" className="mb-3">
                    <FormGroup>
                      <Label>Schema Type</Label>
                      <Input
                        type="select"
                        {...formik.getFieldProps("schema_type")}
                      >
                        <option value="WebPage">Web Page</option>
                        <option value="Article">Article</option>
                        <option value="FAQPage">FAQ Page</option>
                        <option value="Product">Product</option>
                        <option value="HowTo">How-To</option>
                        <option value="BlogPosting">Blog Posting</option>
                        <option value="NewsArticle">News Article</option>
                        <option value="Organization">Organization</option>
                        <option value="LocalBusiness">Local Business</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  
                  <Col md="12" className="mb-3">
                    <EntitiesKeywords
                      value={formik.values.entities_keywords}
                      onChange={(value) => formik.setFieldValue("entities_keywords", value)}
                    />
                  </Col>
                  
                  <Col md="12" className="mb-3">
                    <FAQSection
                      value={formik.values.faq_section}
                      onChange={(value) => formik.setFieldValue("faq_section", value)}
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>

          {/* Custom Scripts */}
          <Col md="12" className="mb-4">
            <Card>
              <CardBody>
                <h4 className="mb-3">Custom Scripts</h4>
                
                <Row>
                  <Col md="6" className="mb-3">
                    <FormGroup>
                      <Label>Google CSE ID</Label>
                      <Input
                        type="text"
                        {...formik.getFieldProps("google_cseid")}
                        placeholder="Enter Google Custom Search Engine ID..."
                      />
                    </FormGroup>
                  </Col>
                  
                  <Col md="12" className="mb-3">
                    <FormGroup>
                      <Label>Custom Head Scripts</Label>
                      <Input
                        type="textarea"
                        {...formik.getFieldProps("custom_head_scripts")}
                        placeholder="Enter custom scripts for head section..."
                        rows="4"
                      />
                    </FormGroup>
                  </Col>
                  
                  <Col md="12" className="mb-3">
                    <FormGroup>
                      <Label>Custom Footer Scripts</Label>
                      <Input
                        type="textarea"
                        {...formik.getFieldProps("custom_footer_scripts")}
                        placeholder="Enter custom scripts for footer section..."
                        rows="4"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>

          {/* Submit */}
          <Col md="12">
            <FormGroup>
              <Button
                className="btn btn-style1 px-4 py-2"
                type="submit"
                disabled={createMutation?.isLoading || updateMutation?.isLoading}
              >
                {createMutation.isLoading || updateMutation?.isLoading ? (
                  <ButtonLoader />
                ) : (
                  isEdit ? 'Update SEO' : 'Create SEO'
                )}
              </Button>
            </FormGroup>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default SEOFormWithGEO;
