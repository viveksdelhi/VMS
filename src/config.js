// src/config/api.js

const API_URL =
  window?.env?.API_URL && window.env.API_URL !== "__API_URL__"
    ? window.env.API_URL
    : import.meta.env.VITE_API_URL;

const CAMERA_API_URL =
  window?.env?.CAMERA_API_URL && window.env.CAMERA_API_URL !== "__CAMERA_API_URL__"
    ? window.env.CAMERA_API_URL
    : import.meta.env.VITE_CAMERA_API_URL;

const NVR_API_URL =
  window?.env?.NVR_API_URL && window.env.NVR_API_URL !== "__NVR_API_URL__"
    ? window.env.NVR_API_URL
    : import.meta.env.VITE_NVR_API_URL;

const PRODUCT_API_URL =
  window?.env?.PRODUCT_API_URL && window.env.PRODUCT_API_URL !== "__PRODUCT_API_URL__"
    ? window.env.PRODUCT_API_URL
    : import.meta.env.VITE_PRODUCT_API_URL;

export { API_URL, CAMERA_API_URL, NVR_API_URL, PRODUCT_API_URL };



// const API_URL =
//   window?.env?.API_URL && window.env.API_URL !== "__API_URL__"
//     ? window.env.API_URL
//     : import.meta.env.VITE_API_URL;

// export { API_URL };
