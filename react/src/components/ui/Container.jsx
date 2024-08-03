/* eslint-disable react/prop-types */
import clsx from "clsx";
import { useMediaQuery } from "@/hooks/Index";

const Container = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={clsx(`mx-auto w-full flex flex-col`, className)} {...props}>
      {children}
    </div>
  );
};

const Row = ({ children, className, ...props }) => {
  return (
    <div className={clsx(`flex w-full flex-wrap`, className)} {...props}>
      {children}
    </div>
  );
};

const Col= ({
  children,
  className,
  size = 100,
  ...props
}) => {
  const md = useMediaQuery("(max-width: 768px)");
  const colStyles = {
    width: md ? "100%" : `${size}%`,
  };

  return (
    <div
      className={clsx(`px-1`, className)}
      {...props}
      style={{
        ...colStyles,
      }}
    >
      {children}
    </div>
  );
};

export { Container, Row, Col };
