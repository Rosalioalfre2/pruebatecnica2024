/* eslint-disable no-prototype-builtins */
import { axiosApi } from "@/libs/axios";

const limpiarJSON = (json, update=false) =>{
  const cleanedJSON = { ...json };

  for (const key in cleanedJSON) {
    if (cleanedJSON.hasOwnProperty(key)) {
      const value = cleanedJSON[key];
      if (update == false) {
        if (value instanceof File || value instanceof FileList) {
          cleanedJSON[key] = value[0];
        } else if (value == null || value == undefined || value == "") {
          delete cleanedJSON[key];
        }
      } else {
        if (value instanceof File || value instanceof FileList) {
          cleanedJSON[key] = value[0];
        } else if (value == null || value == undefined) {
          delete cleanedJSON[key];
        }
      }
    }
  }

  return cleanedJSON;
}

const handlerApi = (ruta, opcion, data)=> {
  let queryGetBy = "";
  if (data?.getBy != undefined && data?.getBy?.length > 0) {
    data.getBy.forEach((element) => {
      queryGetBy +=
        "&" + Object.keys(element)[0] + "=" + Object.values(element)[0];
    });
  }
  let cleanData = null;
  if (opcion == "create") {
    cleanData = limpiarJSON(data);
  } else {
    cleanData = limpiarJSON(data, true);
  }

  let response;

  switch (opcion) {
    case "getAll":
      response = axiosApi.get(`${ruta}/`);
      break;
    case "getPag":
      response = axiosApi.get(
        `${ruta}/?page=${data?.page ?? "1"}&page_size=${
          data?.page_size ?? "-1"
        }${data?.filtro ?? ""}${queryGetBy}`,
      );
      break;
    case "get":
      response = axiosApi.get(`${ruta}/${data?.id}`);
      break;
    case "update":
      response = axiosApi.patch(`${ruta}/${data?.id}/`, { ...cleanData });
      break;
    case "delete":
      response = axiosApi.delete(`${ruta}/${data?.id}/`);
      break;
    case "create":
      response = axiosApi.post(`${ruta}/`, { ...cleanData });
      break;
    default:
      response = {
        status: 404,
        message: "No valido",
      };
      break;
  }

  return response;
};

export { handlerApi, axiosApi };
