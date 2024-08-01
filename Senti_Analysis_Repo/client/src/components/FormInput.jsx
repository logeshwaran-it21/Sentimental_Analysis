export { setState } from "react";
import PropTypes from "prop-types";

export default function FormInput({ type, name, value, setValue }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-slate-200 capitalize"
      >
        {name.replace(/([a-z])([A-Z])/g, "$1 $2")}
      </label>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type={type}
        name={name}
        id={name}
        className="bg-slate-800 border-slate-700 border text-slate-400 placeholder:text-slate-400 sm:text-sm rounded-lg block w-full p-2.5"
        required
      />
    </div>
  );
}

FormInput.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setValue: PropTypes.func.isRequired,
};
