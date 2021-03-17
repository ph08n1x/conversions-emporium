const validations = {
  email: {
    pattern: {
      value: /\S+\@\S+\.\S+/,
      message: 'Vul hier een geldig e-mailadres in',
    },
  },
  number: {
    pattern: {
      value: /^\d*\.?\d*$/,
      message: 'Fill in a valid number',
    },
  },
};

export default validations;
