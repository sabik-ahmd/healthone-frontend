import { useState, useEffect } from "react";
import { loginUser } from "./authService";
import {
    getRememberEmail,
    saveRememberEmail,
    clearRememberEmail,
} from "./authStorage";

export function useLogin() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [remember, setRemember] = useState(false);

    useEffect(() => {
        const savedEmail = getRememberEmail();
        if (savedEmail) {
            setForm((p) => ({...p, email: savedEmail }));
            setRemember(true);
        }
    }, []);

    const handleChange = (e) => {
        setError("");
        setForm({...form, [e.target.name]: e.target.value });
    };

    const submitLogin = async() => {
        if (!form.email || !form.password) {
            throw new Error("Email and password are required");
        }

        setLoading(true);
        try {
            const result = loginUser(form);

            remember
                ?
                saveRememberEmail(form.email) :
                clearRememberEmail();

            return result;
        } finally {
            setLoading(false);
        }
    };

    return {
        form,
        error,
        loading,
        remember,
        setRemember,
        setError,
        handleChange,
        submitLogin,
    };
}