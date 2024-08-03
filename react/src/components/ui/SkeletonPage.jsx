import { Skeleton } from "@nextui-org/react";

const SkeletonPage = () => {
  return (
    <>
      <h1 className="text-4xl">Cargando.....</h1>
      <Skeleton className="rounded-lg">
        <div className="h-full rounded-lg bg-default-300"></div>
      </Skeleton>
    </>
  );
};

export { SkeletonPage };
