import axios from 'axios';
import Config from 'react-native-config';

// let apiURL = Config.API_URL_SCM_PRODUCTION

// if (Config.PUBLIC_STATUS !== "PRODUCTION") {
//     apiURL = Config.API_URL_SCM_DEVELOPMENT
// }
 
let apiURL = "https://scm-api.mallon.click"

const api = axios.create({
    baseURL: apiURL,
});


export default api;