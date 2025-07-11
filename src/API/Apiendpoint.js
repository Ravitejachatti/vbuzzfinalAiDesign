import axios from 'axios'

// create an Axios instance

const instance = axios.create({
    baseURL : 'http://localhost:8000',
    headers:{
        'Content-Type': 'application/json',
    },
    withCredentials: true
})


// Export HTTP methods
export const get = (url, params)=> instance.get(url, {params});
export const post = (url, data)=> instance.post(url, data);
export const put = (url, data)=> instance.put(url, data);
export const deleteUser=(url, data)=> instance.delete(url);

