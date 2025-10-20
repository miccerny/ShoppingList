import React from "react";

export function InputCheck(props) {
    const INPUTS = ["checkbox", "radio"];

    const type = props.type.toLowerCase();
    const checked = props.checked || '';

    if(!INPUTS.includes(type)){
        return null;
    }

    return(
        <div className="form-group form-check">
            <label className="form-check-label">
                <input
                    type={props.name}
                    className="form-check-input"
                    name={props.value}
                    checked={checked}
                    onChange={props.handleChange}
                />{" "}
                {props.label}
            </label>
        </div>
    );
}
export default InputCheck;