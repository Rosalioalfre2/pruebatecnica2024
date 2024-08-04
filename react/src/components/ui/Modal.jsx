/* eslint-disable react/prop-types */
import { Modal as FBModal, Button as FBButton } from "flowbite-react";
import clsx from "clsx";

const Modal= ({
  title,
  children,
  customClasses,
  openBtnTxt,
  btnColor,
  size,
  modal,
  toogleModal,
  showAddButton = true,
  ...props
}) => {
  return (
    <>
      {showAddButton && (
        <FBButton
          color={btnColor ?? "primary"}
          className={clsx("mb-3", customClasses?.button)}
          onClick={toogleModal}
        >
          {openBtnTxt ?? "Abrir"}
        </FBButton>
      )}
      <FBModal
        show={modal}
        onClose={toogleModal}
        className={clsx(customClasses?.modal)}
        size={size ?? "4xl"}
        {...props}
      >
        <FBModal.Header className={clsx(customClasses?.header)}>
          {title}
        </FBModal.Header>
        <FBModal.Body
          className={clsx(customClasses?.body)}
        >
          <div>
            <div
              className="mb-2 pt-1 bg-slate-950"
            ></div>
            <div className="py-4">{children}</div>
            <div
              className="mt-2 pt-1 bg-slate-950"
            ></div>
          </div>
        </FBModal.Body>
      </FBModal>
    </>
  );
};

export { Modal };
