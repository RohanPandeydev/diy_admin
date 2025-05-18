import * as Yup from "yup";



export const LoginFormValidation = Yup.object().shape({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().required("Password is required"),
});


export const BlogFormValidation = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .max(255, 'Title must be at most 255 characters'),
  category_id: Yup.string()
    .required('Category is required'),
  slug: Yup.string()
    .required('Slug is required')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly (lowercase, hyphens only)'),

  content: Yup.string()
    .required('Content is required')
    .min(50, 'Content must be at least 50 characters'),


  is_published: Yup.boolean()
})
export const StaffFormValidation = Yup.object().shape({
  first_name: Yup.string()
    .required('First name is required')
    .max(64, 'First name must be at most 64 characters'),

  last_name: Yup.string()
    .required('Last name is required')
    .max(64, 'Last name must be at most 64 characters'),
  // password: Yup.string().required("Password is required"),


  email: Yup.string()
    .required('Email is required')
    .email('Enter a valid email')
    .max(128, 'Email must be at most 128 characters'),

  designation: Yup.string()
    .required('Designation is required')
    .max(128, 'Designation must be at most 128 characters'),

  phone_number: Yup.string()
    .max(128, 'Phone number must be at most 128 characters'),

});

export const SeoFormValidation = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .max(255, 'Title must be at most 255 characters'),

  slug: Yup.string()
    .required('Slug is required')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly (lowercase, hyphens only)'),

  metaTitle: Yup.string()
    .max(255, 'Meta Title must be at most 255 characters')
    .notRequired(),

  metaDescription: Yup.string()
    .max(255, 'Meta Description must be at most 255 characters')
    .notRequired(),

  metaKeywords: Yup.string()
    .max(255, 'Meta Keywords must be at most 255 characters')
    .notRequired()
    .matches(/^[a-zA-Z0-9, ]*$/, 'Meta Keywords must be alphanumeric and comma separated'),

  canonicalUrl: Yup.string()
    .url('Invalid URL format')
    .max(255, 'Canonical URL must be at most 255 characters')
    .notRequired(),

  ogTitle: Yup.string()
    .max(255, 'Open Graph Title must be at most 255 characters')
    .notRequired(),

  ogDescription: Yup.string()
    .max(255, 'Open Graph Description must be at most 255 characters')
    .notRequired(),

  ogType: Yup.string()
    .oneOf(['website', 'article'], 'Invalid Open Graph Type')
    .notRequired(),

  robots: Yup.string()
    .oneOf(['index, follow', 'noindex, follow', 'index, nofollow', 'noindex, nofollow'], 'Invalid Robots meta tag')
    .notRequired(),

  customHeadScripts: Yup.string()
    .notRequired(),

  customFooterScripts: Yup.string()
    .notRequired(),

  googleCSEId: Yup.string()
    .max(255, 'Google CSE ID must be at most 255 characters')
    .notRequired(),
});
