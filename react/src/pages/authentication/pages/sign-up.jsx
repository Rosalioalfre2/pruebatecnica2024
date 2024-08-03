import clsx from "clsx";
import {
  Alert,
  Button,
  Card,
  // Checkbox,
  Label,
  TextInput,
} from "flowbite-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { axiosPublic } from "@/libs/axios";
// import { notify } from "@/components/toast";
import { useNavigate } from "react-router-dom";
import { HiInformationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

const SignUpPage = function () {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const navigate = useNavigate();
  const [helpBanner, setHelpBanner] = useState("");

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await axiosPublic.post("/auth/register", {
        email: data.email,
        username: data.username,
        password: data.password,
      });
      if (response.status === 200) {
        navigate("/authentication/sign-in");
      }
    } catch (error) {
      setHelpBanner(JSON.stringify(error.response.data, null, 2));
      Object.entries(error.response.data).forEach(([key, value]) => {
        setError(key, {
          type: "validate",
          message: JSON.stringify(value, null, 2),
        });
      });
    }
  });

  return (
    <div
      className={clsx(
        "dark flex flex-col items-center justify-center px-6 lg:h-screen lg:gap-y-12 min-h-screen bg-slate-950",
      )}
    >
      <div className="my-6 flex items-center gap-x-1 lg:my-0">
        <span className="self-center whitespace-nowrap text-3xl font-semibold dark:text-white">
          Prueba tecnica
        </span>
      </div>
      <Card
        horizontal
        imgSrc="/images/authentication/create-account.jpg"
        imgAlt=""
        className="w-full md:max-w-screen-lg md:[&>*]:w-full md:[&>*]:p-16 [&>img]:hidden md:[&>img]:w-96 md:[&>img]:p-0 lg:[&>img]:block"
      >
        {helpBanner != "" && (
          <Alert color="failure" icon={HiInformationCircle}>
            {helpBanner}
          </Alert>
        )}
        <h1 className="mb-3 text-2xl font-bold dark:text-white md:text-3xl">
          Crea una cuenta
        </h1>
        <form onSubmit={onSubmit}>
          <div className="mb-6 flex flex-col gap-y-3">
            <Label htmlFor="password">Tu usuario</Label>
            <TextInput
              id="username"
              placeholder="Ej: rmonterrosa"
              type="text"
              {...register("username", {
                required: { value: true, message: "Este campo es obligatorio" },
                minLength: {
                  value: 3,
                  message: "Debe de tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 75,
                  message: "No debe de tener mas de 16 caracteres",
                },
              })}
              autoComplete="off"
            />
            {errors.username && (
              <>
                <span className="text-sm font-medium text-red-700 dark:text-red-500">
                  {errors?.username?.message}
                </span>
              </>
            )}
          </div>
          <div className="mb-4 flex flex-col gap-y-3">
            <Label htmlFor="email">Tu correo electronico</Label>
            <TextInput
              id="email"
              placeholder="name@company.com"
              type="text"
              {...register("email", {
                required: { value: true, message: "Este campo es obligatorio" },
                pattern: {
                  value: /^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/,
                  message: "Debe de ser un correo electronico válido",
                },
              })}
              autoComplete="off"
            />
            {errors.email && (
              <>
                <span className="text-sm font-medium text-red-700 dark:text-red-500">
                  {errors?.email?.message}
                </span>
              </>
            )}
          </div>
          <div className="mb-6 flex flex-col gap-y-3">
            <Label htmlFor="password">Tu contraseña</Label>
            <TextInput
              id="password"
              placeholder="••••••••"
              type="password"
              {...register("password", {
                required: { value: true, message: "Este campo es obligatorio" },
                // minLength: {
                //   value: 8,
                //   message: "Debe de tener al menos 8 caracteres",
                // },
                maxLength: {
                  value: 16,
                  message: "No debe de tener mas de 16 caracteres",
                },
              })}
              autoComplete="off"
            />
            {errors.password && (
              <>
                <span className="text-sm font-medium text-red-700 dark:text-red-500">
                  {errors?.password?.message}
                </span>
              </>
            )}
          </div>
          {/* <div className="mb-6 flex flex-col gap-y-3">
            <Label htmlFor="confirmPassword">Confirme su contraseña</Label>
            <TextInput
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              type="password"
            />
          </div> */}
          {/* <div className="mb-6 flex items-center gap-x-3">
            <Checkbox id="acceptTerms" name="acceptTerms" />
            <Label htmlFor="acceptTerms">
              Yo acepto los&nbsp;
              <a href="#" className="text-primary-700 dark:text-primary-200">
                Terminos y Condiciones
              </a>
            </Label>
          </div> */}
          <div className="mb-7">
            <Button type="submit" color="blue" className="w-full lg:w-auto">
              Crear cuenta
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            ¿Ya tienes una cuenta?&nbsp;
            <Link
              to="/authentication/sign-in"
              className="text-primary-200 dark:text-primary-700"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default SignUpPage;
