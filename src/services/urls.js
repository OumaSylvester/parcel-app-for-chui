import { baseURL } from "./baseURL";


const getURLs = () => {
    const urls = {}
    urls.getToDosById = (todoId) => `${baseURL}/todos/${todoId}`;
    return urls
}

export default getURLs;