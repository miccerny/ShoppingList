/**
 * FlashMessage component.
 *
 * Responsibilities:
 * - Displays a short feedback message to the user.
 * - Uses Bootstrap alert styling based on provided theme.
 *
 * Note:
 * This component is intentionally kept simple and stateless.
 * It only renders data passed via props and does not manage any logic.
 *
 * @param {Object} props
 * @param {string} props.theme Visual theme of the message (e.g. "success", "danger", "warning")
 * @param {string} props.text Text content of the flash message
 *
 * @returns {JSX.Element} Bootstrap-styled alert message
 */
export function FlashMessage({theme, text}) {

    // My note:
    // Bootstrap alert classes are constructed dynamically
    // based on the provided theme (alert-success, alert-danger, etc.).
    return <div className={"alert alert-" + theme}>{text}</div>
}
export default FlashMessage;