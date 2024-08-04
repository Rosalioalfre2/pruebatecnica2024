/* eslint-disable react/prop-types */
import clsx from "clsx";
import { Modal } from "flowbite-react";
import dayjs from "dayjs";
import { Label, TextInput } from "flowbite-react";
import { Row, Col, Container } from "./Container";

const ModalViewer = ({
  openModal,
  setOpenModal,
  children,
  title,
  size,
  ...props
}) => {

  return (
    <Modal
      show={openModal}
      onClose={() => setOpenModal(false)}
      className={clsx("max-h-screen")}
      size={size ?? "7xl"}
      dismissible
      {...props}
    >
      <Modal.Header>{title ?? ""}</Modal.Header>
      <Modal.Body style={{ overflow: "visible", maxHeight: "fit-content" }}>
        <div style={{ overflow: "auto", maxHeight: "85vh" }}>
          <div
            className="mb-2 pt-1 bg-slate-950"
          />
          {children}
          <div
            className="mt-2 pt-1 bg-slate-950"
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

const DataViewer = ({ data, decorator }) => {
  return (
    <Container>
      <Row>
        {decorator.map((item, index) => (
          <Col size={item?.size ?? 100} key={index} className="mb-2">
            <Label>{item?.label ?? ""}:</Label>
            <TextInput
              theme={themeTextInput}
              value={
                typeof data[item.key ?? ""] === "boolean"
                  ? data[item.key ?? ""]
                    ? "Si"
                    : "No"
                  : typeof data[item.key ?? ""] === "object" &&
                      data[item.key ?? ""] instanceof Date
                    ? dayjs(data[item.key ?? ""]).format("DD-MM-YYYY")
                    : data[item.key ?? ""]
              }
              disabled
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

const Viewer = ({
  modal,
  data,
}) => {
  return (
    <ModalViewer
      openModal={modal.openModal}
      setOpenModal={modal.setOpenModal}
      title={modal.title}
      size={modal.size}
    >
      <DataViewer data={data.data} decorator={data.decorator} />
    </ModalViewer>
  );
};

export { ModalViewer, DataViewer, Viewer };

const themeTextInput = {
  base: "flex w-full",
  addon:
    "inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400",
  field: {
    base: "relative w-full",
    icon: {
      base: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3",
      svg: "h-5 w-5 text-gray-500 dark:text-gray-400",
    },
    rightIcon: {
      base: "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3",
      svg: "h-5 w-5 text-gray-500 dark:text-gray-400",
    },
    input: {
      base: "block w-full",
      sizes: {
        sm: "p-2 sm:text-xs",
        md: "p-2.5 text-sm",
        lg: "sm:text-md p-4",
      },
      colors: {
        gray: "bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500",
        info: "border-cyan-500 bg-cyan-50 text-cyan-900 placeholder-cyan-700 focus:border-cyan-500 focus:ring-cyan-500 dark:border-cyan-400 dark:bg-cyan-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-500",
        failure:
          "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:border-red-500 dark:focus:ring-red-500",
        warning:
          "border-yellow-500 bg-yellow-50 text-yellow-900 placeholder-yellow-700 focus:border-yellow-500 focus:ring-yellow-500 dark:border-yellow-400 dark:bg-yellow-100 dark:focus:border-yellow-500 dark:focus:ring-yellow-500",
        success:
          "border-green-500 bg-green-50 text-green-900 placeholder-green-700 focus:border-green-500 focus:ring-green-500 dark:border-green-400 dark:bg-green-100 dark:focus:border-green-500 dark:focus:ring-green-500",
      },
      withRightIcon: {
        on: "pr-10",
        off: "",
      },
      withIcon: {
        on: "pl-10",
        off: "",
      },
      withAddon: {
        on: "rounded-r-lg",
        off: "rounded-lg",
      },
      withShadow: {
        on: "shadow-sm dark:shadow-sm-light",
        off: "",
      },
    },
  },
};
