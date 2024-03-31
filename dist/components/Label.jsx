import React from "react";
const Label = ({ children, className }) => {
    return (<label className={`block text-white text-sm font-bold mb-2 ${className}`}>
      {children}
    </label>);
};
export default Label;
