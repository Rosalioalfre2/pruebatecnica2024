import axios from "axios";

const ruta = "http://localhost:8000";

const axiosApi = axios.create({
  baseURL: ruta,
});

const axiosPublic = axios.create({
  baseURL: ruta,
});

const unauthorized_route = "/unauthorized";
const refresh_route = "/auth/refresh/";

axiosApi.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Añadir un interceptor para manejar errores de autenticación
axiosApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Si el error es de autenticación y no es una solicitud de actualización de token
    if (
      error.response?.status != undefined &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== refresh_route
    ) {
      originalRequest._retry = true;

      try {
        // Intenta refrescar el token
        const response = await axiosPublic.post(refresh_route, {
          refresh: localStorage.getItem("refresh_token"),
        });

        if (response.status === 200) {
          localStorage.setItem("access_token", response.data.access);
          localStorage.setItem("refresh_token", response.data.refresh);
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return axiosApi(originalRequest);
        } else {
          // Si la actualización no fue exitosa, redirige al usuario al login
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = unauthorized_route;
          return Promise.reject("Error al refrescar el token");
        }
      } catch (refreshError) {
        // Si no se puede refrescar el token, redirige al usuario al login
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("access_token");
        window.location.href = unauthorized_route;
        return Promise.reject(refreshError);
      } finally {
        originalRequest._retry = false; // Limpiar el flag _retry después de la redirección
      }
    }

    return Promise.reject(error);
  },
);

export { ruta, axiosApi, axiosPublic };
