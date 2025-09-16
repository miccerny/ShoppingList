const ErrorMessage = ({message}) =>{
    return(
        <div style={{color: "red", padding: "10px", border: "1px solid red" }}>
            <strong>Chyba</strong> {message}
        </div>
    );
};

export default ErrorMessage;