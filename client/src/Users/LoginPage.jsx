import InputField from "../components/InputField";
import { useEffect, useState } from "react";
import { useSession } from "../contexts/session";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../utils/api";
import { HttpRequestError } from "../Error/HttpRequstError";
import { useFlash } from "../contexts/flash";



const LoginPage = () => {
    const [valuesState, setValueState] = useState({ email: "", password: "" });
    const { session, setSession } = useSession();
    const navigate = useNavigate();
    const {showFlash} = useFlash();

    useEffect(() => {
        if (session.data) {
            showFlash("success", "Přihlášení proběhlo úspěšně");
            navigate("/");
        }
    }, [session]);

    const handleChange = (e) => {
        const fieldName = e.target.name;
        setValueState({ ...valuesState, [fieldName]: e.target.value });

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        apiPost("/login", valuesState)
            .then(data => {
                setSession({ data, status: "authenticated" })
            })
            .catch(e => {
                if(e instanceof HttpRequestError && e.statusCode === 401){
                    showFlash("danger", "Přihlášení se nezdařilo: Špatný email nebo heslo");
                    return;
                }
                if(e instanceof HttpRequestError){
                    showFlash("danger", `Přihlášení se nezdařilo: ${e.message}`);
                }
                showFlash("danger", "Přihlášení se nezdařilo.");
                
            });
        };

    return (
        <div className="login-page">
            <h1>Přihlášení</h1>
            <form onSubmit={handleSubmit}>
                <div className="login-form">
                <InputField
                    type="email"
                    required={true}
                    label="E-mail"
                    onChange={handleChange}
                    value={valuesState.email}
                    prompt="např. karel@seznam.cz"
                    name="email" />
                <InputField
                    type="password"
                    required={true}
                    label="Heslo"
                    onChange={handleChange}
                    value={valuesState.password}
                    prompt="Vyplňte heslo"
                    name="password" />
            </div>
                <input type="submit" className="btn btn-primary mt-2" value="Přihlásit se" />
            </form>
        </div>
    );
}

export default LoginPage;