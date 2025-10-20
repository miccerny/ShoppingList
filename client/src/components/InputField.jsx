
export function InputField(props) {
    const INPUTS = ["text", "number", "date", "password", "email"];

    const type = props.type.toLowerCase();
    const isTextArea = type === "textarea";
    const required = props.required || false;

    if(!isTextArea && !INPUTS.includes(type)){
        return null;
    }

    const minProp = props.min || null;
    const min = ["number", "date"].includes(type) ? minProp : null;
    const minLength = ["text", "textarea", "password", "email"].includes(type) ? minProp :null;


    return(
        <div className="form-group">
            <label>{props.label}</label>
            {/* vykreslení aktuálního elementu */}
            {isTextArea ? (
                <textarea
                required= {required}
                className="form-control"
                placeholder={props.prompt}
                rows={props.rows}
                minLength={minLength}
                name={props.name}
                value={props.value}
                onChange={props.onChange}
                />
            ): (
                <input
                required={required}
                type={type}
                className="form-control"
                placeholder={props.prompt}
                minLength={minLength}
                min={min}
                name={props.name}
                value={props.value}
                onChange={props.onChange}
                />
            )}
        </div>
    );
}

export default InputField;