import axios from "axios";


export const addUser = (user:any) =>{
    return axios.post(`https://localhost:7253/gateway/Account/Register`,user);
}

export const login = async (email:any,password:any) =>{

    const loginData={
        email,
        password,
    };
    return axios.post(`https://localhost:7253/gateway/Account/Login`,loginData);

};

export const requestOtp = (email:any) => {

    return axios.post("https://localhost:7210/api/Account/generate", { email });

};

//https://localhost:7229/api/Accounts/verify-otp

export const verifyOtp = (email:any, otp:any) => {

    return axios.post("https://localhost:7210/api/Account/verify", {

        Email: email,

        OtpCode: otp

    });

};
 


export const  fetchAllUsers= async()=> {
    try {
        const response = await axios.get('https://localhost:7253/gateway/Account'); // Update the URL as needed
        console.log(response);
        return response;
          // Handle users as needed (e.g., display them on the page)
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}


const API_URL = 'https://localhost:7210/api/Account'; // Base URL for your API

// Function to check if the email exists in the system
export const checkEmail = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/check-email`, { email });
    return response.data; // Return the response data for further processing in the component
  } catch (error) {
    throw new Error('Error checking email. Please try again.');
  }
};

// Function to update the password for the given email
export const updatePassword = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/update-password`, { email, password });
    return response.data; // Return the response data for further processing in the component
  } catch (error) {
    throw new Error('Error updating password. Please try again.');
  }
};


export const sendPasswordResetEmail = async (email: string) => {
  try {
    const response = await axios.post('https://localhost:7210/api/Account/request-password-reset', { email });
    return response.data;
  } catch (error) {
    throw new Error('Error sending password reset email');
  }
};


// // Function to send the password reset email request
// export const sendPasswordResetEmail = async (email:any) => {
//     try {
//         // Make a POST request to the forgot-password endpoint
//         const response = await axios.post(`https://localhost:7210/api/Account/request-password-reset`, {
//             email: email
//         });

//         // If the request is successful, return the response data
//         console.log('Password reset email sent:', response.data);
//         return response.data; // You can handle this data further if needed
//     } catch (error) {
//         // Handle errors (e.g., show an error message)
//         console.error('Error sending password reset email:', error);

//         // Optionally, you can throw the error to handle it elsewhere in your app
//         throw error;
//     }
// };

// // Call the function to fetch users

