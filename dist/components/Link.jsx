import React from "react";
const Link = ({ children, className, ...props }) => {
    return (<a className={`text-blue-500 hover:text-blue-700 underline ${className ? className : ""}`} {...props}>
      {children}
    </a>);
};
export default Link;
