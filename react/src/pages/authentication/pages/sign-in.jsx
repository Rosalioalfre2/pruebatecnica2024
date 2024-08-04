import { Card, Label, TextInput, Alert } from "flowbite-react";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { notify } from "@/components/toast";
import { HiInformationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

const SignInPage= function () {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { login } = useAuth();
  const [banner, setBanner] = useState("");

  const onSubmit = handleSubmit(async (data) => {
    const response = await login(data);
    if (response.success == false) {
      notify(response.message, "error");
      setBanner(response.message);
      return;
    }
  });

  return (
    <div className="dark flex h-4/5 min-h-screen flex-col items-center justify-center gap-y-4 bg-black px-4">
      <div
        className="my-2 flex w-full items-center justify-center gap-x-1 py-4 md:my-0 lg:my-0 lg:max-w-[80%] bg-slate-800"
      >
      </div>
      <Card
        horizontal
        imgSrc="/images/authentication/imagelogin.jpg"
        imgAlt=""
        className="w-full md:max-w-screen-lg md:[&>*]:w-full md:[&>*]:p-16 [&>img]:hidden md:[&>img]:w-72 md:[&>img]:p-0 lg:[&>img]:block lg:[&>img]:w-80"
      >
        {banner != "" && (
          <Alert color="failure" icon={HiInformationCircle}>
            {banner}
          </Alert>
        )}
        <h1 className="mb-3 text-2xl font-bold dark:text-white md:text-3xl">
          Iniciar sesión
        </h1>
        <form onSubmit={onSubmit}>
          <div className="mb-4 flex flex-col gap-y-3">
            <Label htmlFor="username">Tu nombre de usuario</Label>
            <TextInput
              id="username"
              placeholder="Ej: rmonterrosa"
              type="text"
              autoComplete="off"
              {...register("username", {
                required: {
                  value: true,
                  message: "Este campo es obligatorio",
                },
                minLength: {
                  value: 3,
                  message: "Debe tener al menos 3 caracteres",
                },
              })}
            />
            {errors.username && (
              <>
                <span className="text-sm font-medium text-red-700 dark:text-red-500">
                  {errors?.username?.message}
                </span>
              </>
            )}
          </div>
          <div className="mb-6 flex flex-col gap-y-3">
            <Label htmlFor="password">Tu contraseña</Label>
            <TextInput
              id="password"
              placeholder="*********"
              type="password"
              autoComplete="off"
              {...register("password", {
                required: {
                  value: true,
                  message: "Este campo es obligatorio",
                },
                minLength: {
                  value: 3,
                  message: "Debe tener al menos 3 caracteres",
                },
              })}
            />
            {errors.password && (
              <>
                <span className="text-sm font-medium text-red-700 dark:text-red-500">
                  {errors?.password?.message}
                </span>
              </>
            )}
          </div>
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-row justify-start">
              <Button
                type="submit"
                color="primary"
                className="w-full sm:w-auto"
              >
                Iniciar sesión
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            ¿Aún no estas registrado?&nbsp;
            <Link
              to="/authentication/sign-up"
              className="text-primary-600 dark:text-primary-700"
            >
              Crear tu cuenta
            </Link>
          </p>
        </form>
      </Card>
      <div
        className="mb-3 w-full py-4 sm:mb-0 lg:max-w-[80%] bg-slate-800"
      ></div>
    </div>
  );
};

export default SignInPage;
