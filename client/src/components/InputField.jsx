/**
 * Reusable form input component.
 *
 * Responsibilities:
 * - Renders either <input> or <textarea> based on provided type.
 * - Handles validation styling and error display.
 * - Provides a consistent UI for form fields across the application.
 *
 * Note:
 * This component is designed as a presentational component.
 * All validation logic and state handling is expected to be managed
 * by the parent component.
 */
export function InputField(props) {

    /**
     * Supported input types for <input> element.
     *
     * Note:
     * Any unsupported type (except textarea) will result
     * in the component not being rendered.
     */
    const INPUTS = ["text", "number", "date", "password", "email"];

    // Normalize input type to lowercase to avoid case-related issues
    const type = props.type.toLowerCase();

    // Determines whether textarea should be rendered instead of input
    const isTextArea = type === "textarea";

    // Required flag defaults to false if not provided
    const required = props.required || false;

    // Validation-related props passed from parent
    const error = props.error;
    const touched = props.touched;

    /**
     * Guard clause:
     * Prevents rendering if an unsupported input type is used.
     *
     * My note:
     * This helps catch configuration mistakes early.
     */
    if (!isTextArea && !INPUTS.includes(type)) {
        return null;
    }

    /**
     * Conditional validation attributes.
     *
     * - min is relevant only for number and date inputs
     * - minLength is relevant only for textual inputs
     */
    const minProp = props.min || null;
    const min = ["number", "date"].includes(type) ? minProp : null;
    const minLength = ["text", "textarea", "password", "email"].includes(type) ? minProp : null;

    // Error is displayed only when field was touched and validation failed
    const hasError = touched && error;

    return (
        <div className="input-group-custom">
            {/* Input label bound to input name */}
            <label htmlFor={props.name} className="input-label">{props.label}</label>
            {/* Renders either textarea or input based on type */}
            {isTextArea ? (
                <textarea
                    required={required}
                    className={`form-control ${hasError ? "is-invalid" : ""}`}
                    placeholder={props.prompt}
                    rows={props.rows}
                    minLength={minLength}
                    name={props.name}
                    value={props.value}
                    onChange={props.onChange}
                    onBlur={props.onBlur}
                />
            ) : (
                <input
                    required={required}
                    type={type}
                    className={`form-control ${hasError ? "is-invalid" : ""}`}
                    placeholder={props.prompt}
                    minLength={minLength}
                    min={min}
                    name={props.name}
                    value={props.value}
                    onChange={props.onChange}
                    onBlur={props.onBlur}
                />
            )}
            {/* Validation error message */}
            {hasError && (
                <div className="invalid-feedback">
                    {error}
                </div>
            )}
        </div>
    );
}

export default InputField;