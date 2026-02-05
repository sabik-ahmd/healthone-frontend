import {
    saveAuth,
    getUsers,
} from "./authStorage";

export const loginUser = ({ email, password }) => {
    // ADMIN
    if (email === "admin@gmail.com" && password === "admin123") {
        saveAuth({ email, role: "admin" });
        return { role: "admin" };
    }

    // USER
    const users = getUsers();
    const user = users.find(
        (u) => u.email === email && u.password === password
    );

    if (!user) {
        throw new Error("Invalid email or password");
    }

    saveAuth({ email: user.email, role: "user" });
    return { role: "user" };
};