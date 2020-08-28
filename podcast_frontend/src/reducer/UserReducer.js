const UserReducer = (state, action) => {
  switch (action.type) {
    case "AUTH":
      return { ...state, isAuthenticated: action.payload };
    case "ERROR_MSG":
      return { ...state, errorMsg: action.payload };
    case "UPDATE_PODS":
      return { ...state, pods: action.payload };
    case "FIRSTNAME_UPDATE":
      return {...state, firstName: action.payload }
    case "CHANGE_ID":
      return { ...state, podId: action.payload };
    case "UPDATE_ADMIN":
      return { ...state, admin: action.payload };
    case "LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export default UserReducer;
