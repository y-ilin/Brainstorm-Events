import axios from "axios";

export default {
    login: function(query) {
        return axios.post("/api/login", { email: query.email, password: query.password })
    },
    signUp: function(query) {
        console.log("api query is: ", query)
        return axios.post("/api/signup", query);
  }
}; 