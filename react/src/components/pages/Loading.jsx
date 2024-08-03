const Loading = () => {
  return (
    <div className="mx-auto flex h-screen flex-col items-center justify-center bg-gray-400 px-6 dark:bg-gray-900 xl:px-0">
      <div className="block md:max-w-lg">
        <img
          src="/images/illustrations/500.svg"
          aria-hidden
          alt="astronaut image"
        />
      </div>
      <div className="text-center xl:max-w-4xl">
        <h1 className="mb-3 text-2xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
          Estamos cargando tu información
        </h1>
        <p className="mb-5 text-base font-normal text-gray-800 dark:text-gray-400 md:text-lg">
          Tu informacion pronto sera servida
        </p>
      </div>
    </div>
  );
};

export default Loading;
