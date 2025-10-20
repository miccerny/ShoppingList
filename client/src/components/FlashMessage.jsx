import React from "react";

export function FLashMessage({theme, text}) {
    return <div className={"alert alert-" + theme}>{text}</div>
}
export default FLashMessage;