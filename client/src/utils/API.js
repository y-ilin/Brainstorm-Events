import axios from "axios";

export default {
    login: query => {
        return axios.post("/api/login", { email: query.email, password: query.password })
    },
    signUp: query => {
        return axios.post("/api/signup", query);
    },
    logout: query => {
        return axios.get("/api/logout", query)
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
    },
    deleteSticky: query => {
        return axios.post("/api/deletesticky", query)
    },
    createComment: query => {
        return axios.post("/api/comment", query)
    },
    changeCommentText: query => {
        return axios.post("/api/changecommenttext", query)
    },
    addVote: query => {
        return axios.post("/api/addvote", query)
    },
    removeVote: query => {
        return axios.post("/api/removevote", query)
    },
    createEvent: query => {
        return axios.post("/api/createevent", query)
    },
    getEventDetails: query => {
        return axios.get("/api/eventdetails", query)
    },
    setDurations: query => {
        return axios.post("/api/setdurations", query)
    },
    setPrompt: query => {
        return axios.post("/api/setprompt", query)
    }
}; 