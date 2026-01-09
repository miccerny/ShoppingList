import "../styles/inputCheck.css";

export function InputCheck({ type, name, checked, value, label, onChange }) {
    const INPUTS = ["checkbox", "radio"];
    const safeType = (type || "").toLowerCase();

    if (!INPUTS.includes(safeType)) {
        return null;
    }

    return (
        <div className="form-group form-check me-3">
            <label className="modern-check">
                <input
                    type={safeType}
                    name={name}
                    checked={checked}
                    value={value}
                    onChange={onChange}
                />{" "}
                <span className="custom-indicator"></span>
                <span className="label-text">{label}</span>
            </label>
        </div>
    );
}
export default InputCheck;