const API_URL =
  window?.env?.API_URL && window.env.API_URL !== '__API_URL__'
    ? window.env.API_URL
    : import.meta.env.VITE_API_URL;

const CAMERA_API_URL =
  window?.env?.CAMERA_API_URL && window.env.CAMERA_API_URL !== '__CAMERA_API_URL__'
    ? window.env.CAMERA_API_URL
    : import.meta.env.VITE_CAMERA_API_URL;

const STREAMING_API_URL =
  window?.env?.STREAMING_API_URL && window.env.STREAMING_API_URL !== '__STREAMING_API_URL__'
    ? window.env.STREAMING_API_URL
    : import.meta.env.VITE_STREAMING_API_URL;

const ONVIF_API_URL =
  window?.env?.ONVIF_API_URL && window.env.ONVIF_API_URL !== '__ONVIF_API_URL__'
    ? window.env.ONVIF_API_URL
    : import.meta.env.VITE_ONVIF_API_URL;

const RECORDING_API_URL =
  window?.env?.RECORDING_API_URL && window.env.RECORDING_API_URL !== '__RECORDING_API_URL__'
    ? window.env.RECORDING_API_URL
    : import.meta.env.VITE_RECORDING_API_URL;

const ANALYTICS_API_URL =
  window?.env?.ANALYTICS_API_URL && window.env.ANALYTICS_API_URL !== '__ANALYTICS_API_URL__'
    ? window.env.ANALYTICS_API_URL
    : import.meta.env.VITE_ANALYTICS_API_URL;

export {
  API_URL,
  CAMERA_API_URL,
  STREAMING_API_URL,
  ONVIF_API_URL,
  RECORDING_API_URL,
  ANALYTICS_API_URL,
};

// const API_URL = window?.env?.API_URL || import.meta.env.VITE_API_URL;
// const CAMERA_API_URL = window?.env?.CAMERA_API_URL || import.meta.env.VITE_CAMERA_API_URL;
// const STREAMING_API_URL = window?.env?.STREAMING_API_URL || import.meta.env.VITE_STREAMING_API_URL;
// const ONVIF_API_URL = window?.env?.ONVIF_API_URL || import.meta.env.VITE_ONVIF_API_URL;
// const RECORDING_API_URL = window?.env?.RECORDING_API_URL || import.meta.env.VITE_RECORDING_API_URL;
// const ANALYTICS_API_URL = window?.env?.ANALYTICS_API_URL || import.meta.env.VITE_ANALYTICS_API_URL;

// export {
//   API_URL,
//   CAMERA_API_URL,
//   STREAMING_API_URL,
//   ONVIF_API_URL,
//   RECORDING_API_URL,
//   ANALYTICS_API_URL
// };
