/**
 * Registration page component.
 *
 * Responsibilities:
 * - Renders registration form
 * - Performs client-side validation (password confirmation)
 * - Sends registration request to backend
 * - Displays field-level validation errors
 *
 * Note:
 * confirmPassword exists ONLY on frontend.
 * It is never sent to the backend.
 */
import InputField from "../components/InputField";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiPost } from "../utils/api";
import { HttpRequestError } from "../Error/HttpRequstError";
import { useFlash } from "../contexts/flash";

const RegistrationPage = () => {
  const nav = useNavigate();
  const { showFlash } = useFlash();
  /**
   * Controlled form values.
   *
   * confirmPassword:
   * - used only for frontend validation
   * - removed before sending request to backend
   */
  const [valuesState, setValuesState] = useState({
    password: "",
    confirmPassword: "",
    email: "",
  });

  /**
   * Backend validation errors mapped to form fields.
   */
  const [fieldErrors, setFieldErrors] = useState({});

  /**
   * Tracks whether a field was interacted with.
   */
  const [touched, setTouched] = useState({});

  /**
   * Maps backend error codes to user-friendly messages.
   */
  const errorMessages = {
    EMAIL_ALREADY_EXISTS: "E-mail je již zaregistrován",
    EMAIL_INVALID_FORMAT: "Neplatný formát e-mailu",
    PASSWORD_TOO_SHORT: "Heslo musí mít alespoň 6 znaků",
  };

  /**
   * Handles registration submit.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setTouched({});

    // Client-side password confirmation validation
    if (valuesState.password !== valuesState.confirmPassword) {
      setFieldErrors({
        confirmPassword: "Hesla se neshodují",
      });
      setTouched({
        confirmPassword: true,
      });
      return;
    }

    /**
     * Remove confirmPassword before sending data to backend.
     *
     * Backend expects only:
     * - email
     * - password
     */
    const { confirmPassword, ...registrationData } = valuesState;

    try {
      await apiPost("/register", registrationData);
      showFlash(
        "success",
        "Registrace proběhla úspěšně. Nyní se můžete přihlásit.",
      );

      nav("/login");
    } catch (e) {
      if (e instanceof HttpRequestError) {
        let data;
        // Try to parse backend validation response
        try {
          data = await e.response.json();
        } catch {
          // Ignore JSON parsing errors
        }
        console.log("ERROR RESPONSE:", data);

        // Field-level backend validation error
        if (data?.field && data?.code) {
          setFieldErrors((prev) => ({
            ...prev,
            [data.field]: errorMessages[data.code] || "Neplatná hodnota",
          }));

          setTouched((prev) => ({
            ...prev,
            [data.field]: true,
          }));
        } else {
          showFlash("danger", "Registrace se nezdařila.");
        }
      } else {
        showFlash("danger", "Neočekávaná chyba během registrace.");
      }
    }
  };

   /**
     * Handles input value changes.
     */
  const handleChange = (e) => {
    const fieldName = e.target.name;
    setValuesState((prev) => ({
      ...prev,
      [fieldName]: e.target.value,
    }));
    setFieldErrors((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
  };

   /**
     * Marks field as touched on blur.
     */
  const handleBlur = (e) => {
    setTouched((prev) => ({
      ...prev,
      [e.target.name]: true,
    }));
  };

  return (
    <div className="registration-page">
      <h1>Registrace</h1>
      <form onSubmit={handleSubmit}>
        <div className="registration-form">
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
            required={true}
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
            required={true}
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
            required={true}
          />
        </div>
        <input
          type="submit"
          className="btn btn-primary mt-2"
          value="Registrovat se"
        ></input>
      </form>
    </div>
  );
};
export default RegistrationPage;
