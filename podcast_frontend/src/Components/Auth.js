/** This Object checks the user authentication state and grant users access to protected Route if authenticated */
const localData = localStorage.getItem("isAuthenticated");
const data = localData !== "undefined" ? JSON.parse(localData) : false;

const AuthCheck = {
  isAuthenticated: data,
  getAuth() {
    return this.isAuthenticated;
  },
};

export default AuthCheck;
