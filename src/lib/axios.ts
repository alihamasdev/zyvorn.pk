import Axios from "axios";

const baseURL = process.env.BASE_URL || "http://localhost:3000";

const axios = Axios.create({ baseURL });

export { axios };
