
// import Cookies from 'js-cookie';
// export const API = "https://vmsapi2.ajeevi.in";
// export const StreamAPI = "https://vmsrecord2.ajeevi.in";
// export const LiveFeedUrl = "https://live2.ajeevi.in/live";
// export const VideoAPI = "https://live2.ajeevi.in/RTSPSavedVideo";
// // export const token  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzAyNjg3MjgsImlzcyI6ImFkbWluIiwiYXVkIjoiYWRtaW4ifQ.epOkYaQeJugOBYQAxXcplfsyovvqI9NHwchBqFU0Z0Y"
// export const token = Cookies.get('authToken');
// export const ANPRAPI = "https://anpr2.ajeevi.in";
// export const detection = "https://analytics2.ajeevi.in";
// // export const detection = "http://192.168.1.117:6006";
// //harshit api
// export const Addcamera = "https://Apibridge.ajeevi.in";
// //===========

import Cookies from 'js-cookie';
export const token = Cookies.get('authToken');

export const API = process.env.REACT_APP_API_URL;  // Fallback to the default URL
export const StreamAPI = process.env.REACT_APP_STREAM_API_URL ;
export const LiveFeedUrl = process.env.REACT_APP_LIVE_FEED_URL ;
export const VideoAPI = process.env.REACT_APP_VIDEO_API_URL ;
export const ANPRAPI = process.env.REACT_APP_ANPR_API_URL ;
export const detection = process.env.REACT_APP_DETECTION_URL ;
export const Addcamera = process.env.REACT_APP_ADDCAMERA_URL ;

