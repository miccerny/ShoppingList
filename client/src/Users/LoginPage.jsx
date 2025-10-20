import FlashMessage from "../components/FlashMessage";
import InputField from "../components/InputField";
import { useEffect, useState } from "react";
import { useSession } from "../contexts/session";
import { data, useNavigate } from "react-router-dom";
import { apiPost} from "../utils/api";
import { HttpRequestError } from "../Error/HttpRequstError";



const LoginPage = () => {
    const [valuesState, setValueState] = useState({email: "", password: ""});
const [errorMessageState, setErrorMessageState] = useState(null);
const {session, setSession} = useSession();
const navigate = useNavigate();

useEffect(() => {
    if(session.data) {
        navigate("/");
    }
}, [session]);

const handleChange = (e) => {
    const fieldName = e.target.name;
    setValueState({...valuesState, [fieldName]: e.target.value});

}

const handleSubmit = (e) => {
    e.preventDefault();
    apiPost("/login", valuesState)
    .then(data => {
    setSession({data, status: "authenticated"})
    })
    .catch(e => {
        if(e instanceof HttpRequestError){
            e.response.text().then(message => setErrorMessageState(message));
            return;
        }
        setErrorMessageState("Při komunikaci se serverem nastala chyba.");
    });
}
    return(
        <div className="offset-4 col-sm-6 mt-5">
            <h1>Přihlášení</h1>
            <form onSubmit={handleSubmit}>
                {errorMessageState ? <FlashMessage theme={"danger"} text={errorMessageState}></FlashMessage>: null}
            
            <InputField
                    type="email"
                    required={true}
                    label="E-mail"
                    onChange={handleChange}
                    value={valuesState.email}
                    prompt="E-mail"
                    name="email"/>
                <InputField
                    type="password"
                    required={true}
                    label="Heslo"
                    onChange={handleChange}
                    value={valuesState.password}
                    prompt={"Heslo"}
                    name="password"/>

                    <input type="submit" className="btn btn-primary mt-2" value="Přihlásit se"/>
            </form>
        </div>
    );
}

export default LoginPage;