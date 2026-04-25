const {default:axios} = require("axios")

export const BASE_URL = "http://localhost:8000"

export const clientServer = axios.create({ //axios is used to interact with backend
    baseURL:BASE_URL
})