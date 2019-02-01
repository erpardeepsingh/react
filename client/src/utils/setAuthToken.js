import axios from 'axios';

const setAuthToken=(token)=>{
if(token){
    // Apply to every request

    // we have used Authorization for headers in POSTMAN
    axios.defaults.headers.common['Authorization']=token; 
}else{
    // Delete auth header
    delete axios.defaults.headers.common['Authorization'];
}
};

export default setAuthToken;