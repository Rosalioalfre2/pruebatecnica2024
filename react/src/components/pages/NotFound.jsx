import { useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/react";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="mx-auto flex h-screen flex-col items-center justify-center px-6 dark:bg-gray-900 xl:px-0">
      <div className="block md:max-w-lg">
        <img
          src="/images/illustrations/404.svg"
          aria-hidden
          alt="astronaut image"
        />
      </div>
      <div className="text-center xl:max-w-4xl">
        <h1 className="mb-3 text-2xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
          Page not found
        </h1>
        <p className="mb-5 text-base font-normal text-gray-500 dark:text-gray-400 md:text-lg">
          Oops! Parece que estas usando un enlace incorrecto, si crees que esto
          es un error, por favor haz no lo saber.
        </p>
        <Button onClick={() => navigate(-1)} color="primary">
          <svg
            className="-ml-1 mr-2 size-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
          Regresar
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
