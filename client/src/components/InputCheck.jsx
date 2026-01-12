/**
 * Reusable checkbox / radio input component.
 *
 * Responsibilities:
 * - Renders a styled checkbox or radio button.
 * - Ensures only supported input types are rendered.
 * - Delegates state handling to the parent component.
 *
 * Note:
 * This component focuses purely on presentation and user interaction.
 * Validation and state management are intentionally handled outside.
 */
import "../styles/inputCheck.css";

/**
 * InputCheck component.
 *
 * @param {Object} props
 * @param {"checkbox"|"radio"} props.type Type of input element
 * @param {string} props.name Input group name
 * @param {boolean} props.checked Current checked state
 * @param {string} props.value Input value
 * @param {string} props.label Text displayed next to the input
 * @param {Function} props.onChange Change handler passed from parent
 *
 * @returns {JSX.Element|null} Styled checkbox/radio or null if type is invalid
 */
export function InputCheck({ type, name, checked, value, label, onChange }) {

     /**
     * Supported input types.
     *
     * My note:
     * Restricting supported types avoids accidental misuse
     * of this component for unsupported form controls.
     */
    const INPUTS = ["checkbox", "radio"];

    // Normalize input type to lowercase and guard against undefined
    const safeType = (type || "").toLowerCase();

    /**
     * Guard clause:
     * Do not render component if unsupported input type is provided.
     */
    if (!INPUTS.includes(safeType)) {
        return null;
    }

    return (
        <div className="form-group form-check me-3">
            <label className="modern-check">
                {/* Native input element */}
                <input
                    type={safeType}
                    name={name}
                    checked={checked}
                    value={value}
                    onChange={onChange}
                />
                {/* Custom visual indicator (styled via CSS) */}
                <span className="custom-indicator"></span>
                {/* Label text displayed next to the input */}
                <span className="label-text">{label}</span>
            </label>
        </div>
    );
}
export default InputCheck;