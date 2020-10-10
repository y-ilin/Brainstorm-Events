import axios from "axios";

export default {
    login: query => {
        return axios.post("/api/login", { email: query.email, password: query.password })
    },
    signUp: query => {
        console.log("api query is: ", query)
        return axios.post("/api/signup", query);
    },
    loadStickies: () => {
        console.log("API call to load all stickies")
        return axios.get("/api/sticky")
    },
    createSticky: query => {
        console.log("API call to create new sticky")
        return axios.post("/api/sticky", query);
    }
}; 