import Cookies from "js-cookie";

export const token = Cookies.get("authToken");
export const username = Cookies.get("username");
export const userId = parseInt(Cookies.get("user_id"));
export const CREDIT_ID = parseInt(Cookies.get("credit_id"));

const env = window._env_ || {};

export const API            = env.REACT_APP_API_URL       || process.env.REACT_APP_API_URL;
export const CreditAPI      = env.REACT_APP_CREDIT_API_URL|| process.env.REACT_APP_CREDIT_API_URL;
export const StreamAPI      = env.REACT_APP_STREAM_API_URL|| process.env.REACT_APP_STREAM_API_URL;
export const LiveFeedUrl    = env.REACT_APP_LIVE_FEED_URL || process.env.REACT_APP_LIVE_FEED_URL;
export const VideoAPI       = env.REACT_APP_VIDEO_API_URL || process.env.REACT_APP_VIDEO_API_URL;
export const ANPRAPI        = env.REACT_APP_ANPR_API_URL  || process.env.REACT_APP_ANPR_API_URL;
export const detection      = env.REACT_APP_DETECTION_URL || process.env.REACT_APP_DETECTION_URL;
export const Addcamera      = env.REACT_APP_ADDCAMERA_URL || process.env.REACT_APP_ADDCAMERA_URL;
export const ONVIFAPI       = env.REACT_APP_ONVIF_URL     || process.env.REACT_APP_ONVIF_URL;
export const Stream         = env.REACT_APP_STREAM_URL     || process.env.REACT_APP_STREAM_URL;


// import Cookies from "js-cookie";
// export const token = Cookies.get("authToken");
// export const username = Cookies.get("username");
// export const userId = parseInt(Cookies.get("user_id"));
// export const CREDIT_ID = parseInt(Cookies.get("credit_id"));

// export const API = process.env.REACT_APP_API_URL; // Fallback to the default URL
// export const CreditAPI = process.env.REACT_APP_CREDIT_API_URL; // Fallback to the default URL
// export const StreamAPI = process.env.REACT_APP_STREAM_API_URL;
// export const LiveFeedUrl = process.env.REACT_APP_LIVE_FEED_URL;
// export const VideoAPI = process.env.REACT_APP_VIDEO_API_URL;
// export const ANPRAPI = process.env.REACT_APP_ANPR_API_URL;
// export const detection = process.env.REACT_APP_DETECTION_URL;
// export const Addcamera = process.env.REACT_APP_ADDCAMERA_URL;
// export const ONVIFAPI = process.env.REACT_APP_ONVIF_URL;
// export const Stream = process.env.REACT_APP_STREAM_URL;
