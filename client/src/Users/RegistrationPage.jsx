import InputField from "../components/InputField"
import FlashMessage from "../components/FlashMessage";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiPost } from "../utils/api";
import { HttpRequestError } from "../Error/HttpRequstError";


const RegistrationPage = () => {
    const nav = useNavigate();
    const [errorMesageState, setErrorMessageState] = useState(null);
    const [valuesState, setValuesState] = useState({ password: "", confirmPassword: "", email: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (valuesState.password !== valuesState.confirmPassword) {
            setErrorMessageState("Hesla se nerovnají");
            return;
        }
        const { confirmPassword, ...registrationData } = valuesState;
        apiPost("/register", registrationData)
            .then(() => {
                nav("/me");
            }).catch(async (e) => {
                if (e instanceof HttpRequestError && e.response.status === 400) {
                    const msg = await e.response.text();
                    setErrorMessageState(msg);
                }else{
                    setErrorMessageState("Při komunikaci se serverem nastala chyba.");
                }
            })
    }
    const handleChange = (e) => {
        const fieldName = e.target.name;
        setValuesState({ ...valuesState, [fieldName]: e.target.value });
    };

    return (
        <div>
            <h1>Registrace</h1>
            <form onSubmit={handleSubmit}>
                {errorMesageState ? <FlashMessage theme={"danger"} text={errorMesageState}></FlashMessage> : null}
                <InputField
                    type="email"
                    name="email"
                    label="E-mail"
                    prompt="Zadejte váš email"
                    value={valuesState.email}
                    onChange={handleChange}
                />
                <InputField
                    type="password"
                    name="password"
                    label="Heslo"
                    prompt="Zadejte Vaše heslo"
                    min={6}
                    value={valuesState.password}
                    onChange={handleChange}
                    />
                <InputField
                    type="password"
                    name="confirmPassword"
                    label="Heslo znovu"
                    prompt="Zadejte Vaše heslo znovu"
                    value={valuesState.confirmPassword}
                    onChange={handleChange} />
                <input type="submit" className="btn btn-primary mt-2" value="Registrovat se"></input>
            </form>
        </div>
    );
}
export default RegistrationPage;