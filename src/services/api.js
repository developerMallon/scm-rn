import axios from 'axios';
import { config } from '../../config';

// Carrega as variáveis de ambiente
const { PUBLIC_STATUS, API_URL_SCM_PRODUCTION, API_URL_SCM_DEVELOPMENT } = config;

// Seta a apiURL com o valor configurado na variável de ambiente de PRODUÇÃO
let apiURL = API_URL_SCM_PRODUCTION

// Se a variável de status for diferente de PRODUÇÃO seta apiURL com o valor configurado para DESENVOLVIMENTO
if (PUBLIC_STATUS !== "PRODUCTION") {
    apiURL = API_URL_SCM_DEVELOPMENT
}
// console.log('apiURL: ', apiURL)
// Configura a baseURL do axios conforme a situação (DESENVOLVIMENTO ou DESENVOLVIMENTO)
const api = axios.create({
    baseURL: apiURL,
});


export default api;