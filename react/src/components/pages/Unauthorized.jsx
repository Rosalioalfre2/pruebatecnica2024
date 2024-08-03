import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const NotFound = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="mx-auto flex h-screen flex-col items-center justify-center px-6 dark:bg-gray-900 xl:px-0">
      <img
        className="h-1/4 sm:h-1/2"
        src="/images/illustrations/401.svg"
        alt="No esta autorizado"
      />
      <div className="text-center xl:max-w-4xl">
        <h1 className="mb-3 text-2xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
          Lo sentimos, usted no esta autorizado a esta ruta o algun elemento de
          esta ruta.
        </h1>
        <p className="mb-5 text-base font-normal text-gray-500 dark:text-gray-400 md:text-lg">
          Oops! No tienes permisos para esta ruta, puedes probar iniciando
          sesión con otra cuenta, o si crees que esto es un error contacte con
          soporte tenico.
        </p>
        <div className="flex items-center justify-center">
          <Link
            to="/"
            className="mr-3 inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <svg
              className="mr-2 h-6 w-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 5H1m0 0 4 4M1 5l4-4"
              />
            </svg>
            Ir al inicio
          </Link>
          <button
            onClick={() => {
              logout();
              navigate("/authentication/sign-in");
            }}
            className="mr-3 inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Probar con otra cuenta
            <svg
              className="ml-2 h-6 w-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
