const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Añade un 0 si el mes es de un solo dígito
  const day = String(today.getDate()).padStart(2, "0"); // Añade un 0 si el día es de un solo dígito
  return `${year}-${month}-${day}`;
};

export { getToday };
