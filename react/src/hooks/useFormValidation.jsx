const typeValidation = (type, required = false) => {
  let validation = {};
  switch (type) {
    case "name":
      validation = {
        minLength: 3,
        maxLength: 50,
        pattern: {
          value: /^[a-zA-ZáéíóúüñÑÁÉÍÓÚ\s]+$/,
          message:
            "Debe ingresar un nombre sin caracteres especiales ni numeros",
        },
      };
      break;
    case "dui":
      validation = {
        minLength: 10,
        maxLength: 10,
        pattern: {
          value: /^\d{8}-\d{1}$/,
          message: "Debe cumplir con el estandar, ejemplo: 06047506-1",
        },
      };
      break;
    case "nit":
      validation = {
        minLength: 17,
        maxLength: 17,
        pattern: {
          value: /^\d{4}-\d{6}-\d{3}-\d{1}$/,
          message: "Debe cumplir con el estandar, ejemplo: 0511-240500-101-3",
        },
      };
      break;
    case "email":
      validation = {
        minLength: 5,
        maxLength: 40,
        pattern: {
          value:
            /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
          message: "Ingrese un correo valido. Ej: rmonterrosa@grupomapa.com",
        },
      };
      break;
    case "tel":
      validation = {
        minLength: 9,
        maxLength: 9,
        pattern: {
          value: /^\d{4}-\d{4}$/,
          message: "Ingrese un telefono valido. Ej: 7039-2222",
        },
      };
      break;
    case "codigo":
      validation = {
        pattern: {
          value: /^\w{3,4}$/,
          message:
            "Minimo 3 caracteres y Maximo 4 caracteres o numeros, la 'ñ' no es valida",
        },
      };
      break;
    case "codigo_fel_mun":
      validation = {
        pattern: {
          value: /^\d{2}-\d{2}$/,
          message: "Debe seguir el estandar. Ej: 02-99",
        },
      };
      break;
    case "codigo_fel_dep":
      validation = {
        pattern: {
          value: /^\d{2}$/,
          message: "Debe seguir el estandar. Ej: 01",
        },
      };
      break;
    case "direccion":
      validation = {
        maxLength: 255,
        minLength: 5,
      };
      break;
    default:
      validation = {};
      break;
  }

  if (required) {
    validation = { ...validation, required: true };
  }

  return validation;
};

const messageValidation = (items) => {
  const validation= {};

  if (!items && typeof items != "object") {
    return items;
  }

  Object.keys(items).forEach((key) => {
    let element = {};
    switch (key.trim()) {
      case "required":
        element =
          items[key] == true
            ? { value: true, message: "Este campo es obligatorio" }
            : false;
        break;
      case "minLength":
        element =
          items[key] && Number.isInteger(items[key]) && Number(items[key]) > 0
            ? {
                value: Number(items[key]),
                message: `Debe tener al menos ${items[key]} caracteres`,
              }
            : 0;
        break;
      case "maxLength":
        element =
          items[key] && Number.isInteger(items[key]) && Number(items[key]) > 0
            ? {
                value: Number(items[key]),
                message: `No debe tener mas de ${items[key]} caracteres`,
              }
            : 100;
        break;
      case "min":
        element = items[key]
          ? {
              value: items[key],
              message: `Debe ingresar un valor mayor igual a ${items[key]}`,
            }
          : {
              value: 0,
              message: `Debe ingresar un valor mayor igual a 0`,
            };
        break;
      case "max":
        element = items[key]
          ? {
              value: Number(items[key]),
              message: `Debe ingresar un valor menor igual a ${items[key]}`,
            }
          : 100;
        break;
      default:
        element = items[key];
        break;
    }
    validation[key.trim()] = element;
  });
  return validation;
};

const getPlaceholder = (type) => {
  let placeholder = "";
  switch (type) {
    case "dui":
      placeholder = "Ej: 06047506-2";
      break;
    case "nit":
      placeholder = "Ej: 0511-240500-101-4";
      break;
    case "tel":
      placeholder = "Ej: 7039-2222";
      break;
    case "codigo":
      placeholder = "Ej: 0205";
      break;
    case "codigo_fel_mun":
      placeholder = "Ej: 02-05";
      break;
    case "codigo_fel_dep":
      placeholder = "Ej: 72";
      break;
    default:
      break;
  }
  return placeholder;
};

const getInputmask = (type) => {
  let inputmask = "";
  switch (type) {
    case "dui":
      inputmask = "99999999-9";
      break;
    case "nit":
      inputmask = "9999-999999-999-9";
      break;
    case "tel":
      inputmask = "9999-9999";
      break;
    case "codigo_fel_mun":
      inputmask = "99-99";
      break;
    case "codigo_fel_dep":
      inputmask = "99";
      break;
    default:
      break;
  }
  return inputmask;
};

export { typeValidation, messageValidation, getPlaceholder, getInputmask };
