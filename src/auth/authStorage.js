export const saveAuth = (data) => {
    localStorage.setItem("auth", JSON.stringify(data));
};

export const getUsers = () => {
    return JSON.parse(localStorage.getItem("users")) || [];
};

export const saveRememberEmail = (email) => {
    localStorage.setItem("rememberEmail", email);
};

export const getRememberEmail = () => {
    return localStorage.getItem("rememberEmail");
};

export const clearRememberEmail = () => {
    localStorage.removeItem("rememberEmail");
};