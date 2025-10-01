// src/config/api.js

const API_URL =
  window?.env?.API_URL && window.env.API_URL !== "__API_URL__"
    ? window.env.API_URL
    : import.meta.env.VITE_API_URL;

const CAMERA_API_URL =import.meta.env.VITE_CAMERA_API_URL;
  // window?.env?.CAMERA_API_URL && window.env.CAMERA_API_URL !== "__CAMERA_API_URL__"
  //   ? window.env.CAMERA_API_URL
  //   : import.meta.env.VITE_CAMERA_API_URL;

const NVR_API_URL =
  window?.env?.NVR_API_URL && window.env.NVR_API_URL !== "__NVR_API_URL__"
    ? window.env.NVR_API_URL
    : import.meta.env.VITE_NVR_API_URL;

const STREAM_API_URL =import.meta.env.VITE_STREAM_API_URL
  // window?.env?.STREAM_API_URL && window.env.STREAM_API_URL !== "__STREAM_API_URL__"
  //   ? window.env.STREAM_API_URL
  //   : import.meta.env.VITE_STREAM_API_URL;
const ONVIF_API_URL =import.meta.env.VITE_ONVIF_API_URL
  // window?.env?.ONVIF_API_URL && window.env.ONVIF_API_URL !== "__ONVIF_API_URL__"
  //   ? window.env.ONVIF_API_URL
  //   : import.meta.env.VITE_ONVIF_API_URL;

export { API_URL, CAMERA_API_URL, NVR_API_URL, STREAM_API_URL, ONVIF_API_URL };



// const API_URL =
//   window?.env?.API_URL && window.env.API_URL !== "__API_URL__"
//     ? window.env.API_URL
//     : import.meta.env.VITE_API_URL;

// export { API_URL };
