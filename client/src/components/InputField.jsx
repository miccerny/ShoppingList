
export function InputField(props) {
    const INPUTS = ["text", "number", "date", "password", "email"];

    const type = props.type.toLowerCase();
    const isTextArea = type === "textarea";
    const required = props.required || false;
    const error = props.error;
    const touched = props.touched;

    if (!isTextArea && !INPUTS.includes(type)) {
        return null;
    }

    const minProp = props.min || null;
    const min = ["number", "date"].includes(type) ? minProp : null;
    const minLength = ["text", "textarea", "password", "email"].includes(type) ? minProp : null;
    const hasError = touched && error;

    return (
        <div className="input-group-custom">
            <label htmlFor={props.name} className="input-label">{props.label}</label>
            {/* vykreslení aktuálního elementu */}
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

            {hasError && (
                <div className="invalid-feedback">
                    {error}
                </div>
            )}
        </div>
    );
}

export default InputField;