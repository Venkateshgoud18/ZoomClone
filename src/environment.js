let IS_PROD=true;
const server=IS_PROD ?
    "https://zoombackendservice.onrender.com":
    "http://localhost:8000"
    


export default server;