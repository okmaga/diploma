export function validator(data, config) {
  const errors = {};
  function validate(validateMethod, data, config) {
    let statusValidate;
    switch (validateMethod) {
    case "isRequired": {
      if (typeof data === "boolean") {
        statusValidate = !data;
      } else if (typeof data === "number") {
        statusValidate = isNaN(data);
      } else {
        statusValidate = data.trim() === "";
      }
      break;
    }
    case "lettersOnly": {
      const lettersOnlyRegExp = /\p{L}+$/gu;
      statusValidate = !lettersOnlyRegExp.test(data);
      break;
    }
    case "numbersOnly": {
      const numbersOnlyRegExp = /^\d+$/g;
      statusValidate = !numbersOnlyRegExp.test(data);
      break;
    }
    case "isYear": {
      const yearRegExp = /^(19\d{2}|200\d|2010)$/g;
      statusValidate = !yearRegExp.test(data);
      break;
    }
    case "isUrl": {
      const urlRegExp = /^(http|https):\/\/.[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/g;
      statusValidate = !urlRegExp.test(data);
      break;
    }
    case "isEmail": {
      const emailRegExp = /^\S+@\S+\.\S+$/g;
      statusValidate = !emailRegExp.test(data);
      break;
    }
    case "isCapitalSymbol": {
      const capitalRegExp = /[A-Z]+/g;
      statusValidate = !capitalRegExp.test(data);
      break;
    }
    case "isContainDigit": {
      const digitRegExp = /\d+/g;
      statusValidate = !digitRegExp.test(data);
      break;
    }
    case "min": {
      statusValidate = data.length < config.value;
      break;
    }
    case "max": {
      statusValidate = data.length > config.value;
      break;
    }
    default:
      break;
    };
    if (statusValidate) return config.message;
  };
  for (const fieldName in data) {
    for (const validateMethod in config[fieldName]) {
      const error = validate(
        validateMethod,
        data[fieldName],
        config[fieldName][validateMethod]);
      if (error && !errors[fieldName]) {
        errors[fieldName] = error;
      }
    };
  };
  return errors;
};
