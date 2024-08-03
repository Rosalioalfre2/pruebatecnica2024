import { toast } from "react-toastify";

const darkTopRight = {
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
  theme: `${
    localStorage.getItem("flowbite-theme-mode")
      ? localStorage.getItem("flowbite-theme-mode")
      : "light"
  }`,
  pauseOnFocusLoss: false,
};

const notify = (message, type) => {
  switch (type) {
    case "info":
      toast.info(message, darkTopRight);
      break;
    case "success":
      toast.success(message, darkTopRight);
      break;
    case "warning":
      toast.warning(message, darkTopRight);
      break;
    case "error":
      toast.error(message, darkTopRight);
      break;
    default:
      toast(message, darkTopRight);
      break;
  }
};

export { darkTopRight, notify };
