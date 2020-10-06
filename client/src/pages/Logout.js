import axios from "axios";

function Logout(props) {
    const data = {};

    axios.get("./api/logout", data)
    .then(() => {
        props.setLoggedIn(false);
    })
    return Logout;
}

export default Logout;
