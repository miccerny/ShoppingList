import InputField from "../components/InputField"
import FlashMessage from "../components/FlashMessage";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiPost } from "../utils/api";
import { HttpRequestError } from "../Error/HttpRequstError";


const RegistrationPage = () => {
    const nav = useNavigate();
    const [errorMessageState, setErrorMessageState] = useState(null);
    const [valuesState, setValuesState] = useState({ password: "", confirmPassword: "", email: "" });
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});
    const errorMessages = {
        EMAIL_ALREADY_EXISTS: "E-mail je již zaregistrován",
        EMAIL_INVALID_FORMAT: "Neplatný formát e-mailu",
        PASSWORD_TOO_SHORT: "Heslo musí mít alespoň 6 znaků"
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessageState(null);

        if (valuesState.password !== valuesState.confirmPassword) {
            setFieldErrors({
                confirmPassword: "Hesla se neshodují"
            });
            setTouched({
                confirmPassword: true
            });
            return;
        }

        const { confirmPassword, ...registrationData } = valuesState;

        try {
            await apiPost("/register", registrationData);
            nav("/login");
        } catch (e) {
            if (e instanceof HttpRequestError) {

                // 🔑 TADY je ta změna: json místo text()
                const data = await e.response.json();
                console.log("ERROR RESPONSE:", data);
                if (data?.field && data?.code) {
                    setFieldErrors(prev => ({
                        ...prev,
                        [data.field]: errorMessages[data.code] || "Neplatná hodnota"
                    }));

                    setTouched(prev => ({
                        ...prev,
                        [data.field]: true
                    }));

                } else {
                    setErrorMessageState("Nepodařilo se odeslat formulář");
                }
            } else {
                setErrorMessageState("Neočekávaná chyba aplikace");
            }
        }
    };
    const handleChange = (e) => {
        const fieldName = e.target.name;
        setValuesState(prev => ({
            ...prev, [fieldName]: e.target.value 
        }));
        setFieldErrors(prev => ({
            ...prev,
            [fieldName]: null
        }));
    };

    const handleBlur = (e) => {
        setTouched(prev => ({
            ...prev,
            [e.target.name]: true
        }));
    };

    return (
        <div>
            <h1>Registrace</h1>
            <form onSubmit={handleSubmit}>
                {errorMessageState ? <FlashMessage theme={"danger"} text={errorMessageState}></FlashMessage> : null}
                <InputField
                    type="email"
                    name="email"
                    label="E-mail"
                    prompt="Zadejte váš email"
                    value={valuesState.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={fieldErrors.email}
                    touched={touched.email}
                />
                <InputField
                    type="password"
                    name="password"
                    label="Heslo"
                    prompt="Zadejte Vaše heslo"
                    min={6}
                    value={valuesState.password}
                    onChange={handleChange}
                    error={fieldErrors.password}
                    touched={touched.password}
                    onBlur={handleBlur}
                />
                <InputField
                    type="password"
                    name="confirmPassword"
                    label="Heslo znovu"
                    prompt="Zadejte Vaše heslo znovu"
                    value={valuesState.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={fieldErrors.confirmPassword}
                    touched={touched.confirmPassword}
                />

                <input type="submit" className="btn btn-primary mt-2" value="Registrovat se"></input>
            </form>
        </div>
    );
}
export default RegistrationPage;