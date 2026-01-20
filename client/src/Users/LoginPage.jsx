/**
 * Login page component.
 *
 * Responsibilities:
 * - Renders login form (email + password)
 * - Sends login request to backend
 * - Stores authenticated session on success
 * - Displays user-friendly error messages
 *
 * Beginner note:
 * This page does NOT store authentication permanently.
 * It only updates global session context after successful login.
 */
import InputField from "../components/InputField";
import { useEffect, useState } from "react";
import { useSession } from "../contexts/session";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../utils/api";
import { HttpRequestError } from "../Error/HttpRequstError";
import { useFlash } from "../contexts/flash";

const LoginPage = () => {
  /**
   * Form state (controlled inputs).
   */
  const [valuesState, setValueState] = useState({ email: "", password: "" });

  /**
   * Global session context.
   */
  const { session, setSession } = useSession();

  /**
   * Global session context.
   */
  const navigate = useNavigate();
  const { showFlash } = useFlash();

  /**
   * Redirects user after successful login.
   *
   * Note:
   * Session is updated asynchronously, therefore we react to its change here.
   */
  useEffect(() => {
    if (session.data) {
      showFlash("success", "Přihlášení proběhlo úspěšně");
      navigate("/");
    }
  }, [session]);

  /**
     * Handles input value changes.
     */
  const handleChange = (e) => {
    const fieldName = e.target.name;
    setValueState({ ...valuesState, [fieldName]: e.target.value });
  };

  /**
     * Sends login request to backend.
     */
  const handleSubmit = (e) => {
    e.preventDefault();
    apiPost("/login", valuesState)
      .then((data) => {
        // Save authenticated user into session context
        setSession({ data, status: "authenticated" });
      })
      .catch((e) => {
         // Invalid credentials
        if (e instanceof HttpRequestError && e.statusCode === 401) {
          showFlash(
            "danger",
            "Přihlášení se nezdařilo: Špatný email nebo heslo",
          );
          return;
        }
        // Other HTTP error
        if (e instanceof HttpRequestError) {
          showFlash("danger", `Přihlášení se nezdařilo: ${e.message}`);
        }
        // Unexpected error
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
            name="email"
          />
          <InputField
            type="password"
            required={true}
            label="Heslo"
            onChange={handleChange}
            value={valuesState.password}
            prompt="Vyplňte heslo"
            name="password"
          />
        </div>
        <input
          type="submit"
          className="btn btn-primary mt-2"
          value="Přihlásit se"
        />
      </form>
    </div>
  );
};

export default LoginPage;
