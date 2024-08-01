import PropTypes from "prop-types";

export default function FormError({ error }) {
  return <p className="text-md text-center font-light text-red-300">{error}</p>;
}

FormError.propTypes = {
  error: PropTypes.string.isRequired,
};
