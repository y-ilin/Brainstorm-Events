import axios from "axios";

export default {
    login: query => {
        return axios.post("/api/login", { email: query.email, password: query.password })
    },
    signUp: query => {
        return axios.post("/api/signup", query);
    },
    loadStickies: () => {
        return axios.get("/api/sticky")
    },
    createSticky: query => {
        return axios.post("/api/sticky", query);
    },
    moveSticky: query => {
        return axios.post("/api/movesticky", query)
    },
    changeStickyText: query => {
        return axios.post("/api/changestickytext", query)
    }
}; 