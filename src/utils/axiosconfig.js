// Retrieve user token from localStorage
const userToken = localStorage.getItem("user");
let authToken = "";

// Check if user token exists in localStorage
if (userToken) {
  try {
    // Parse the user token
    const userData = JSON.parse(userToken);
    
    // Get the token value from user data
    authToken = userData.token;
  } catch (error) {
    console.error("Error parsing user token:", error);
  }
}

// Create the config object with headers
export const config = {
  headers: {
    Authorization: `Bearer ${authToken}`,
    Accept: "application/json",
  },
};
