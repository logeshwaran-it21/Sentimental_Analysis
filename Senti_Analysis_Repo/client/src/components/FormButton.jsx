// import React from 'react';
import PropTypes from "prop-types";

export default function FormButton({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-slate-900 rounded-lg py-2 border-slate-800 border"
    >
      {text}
    </button>
  );
}

FormButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
