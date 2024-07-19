import React, { useEffect, useState } from "react";

const ThemedButton = ({ handleSubmit, value, title, disable }) => {
  return (
    <button
      onClick={handleSubmit}
      className={`submitButtonStyle ${
        disable ? "submitButtonDisabledStyle" : "submitButtonActiveStyle"
      }`}
      disabled={disable}
    >
      {title}
    </button>
  );
};

export default ThemedButton;
