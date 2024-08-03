import { axiosPublic } from "@/libs/axios";

const login = async (data) => {
  try {
    const response = await axiosPublic.post("/auth/login/", {
      username: data.username,
      password: data.password,
    });
    return response;
  } catch (error) {
    return {
      status: error.response.status,
      message: error.response.data.detail,
    };
  }
};

const registerUser = async (data) => {
  try {
    const response = await axiosPublic.post("/auth/register", {
      email: data.email,
      username: data.username,
      password: data.password,
    });
    return response;
  } catch (error) {
    return {
      status: 400,
      message: "Error en la peticion",
    };
  }
};

export { login, registerUser };
