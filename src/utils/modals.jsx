import Swal from "sweetalert2";

const SingleToast = (title) => {
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: title,
    showConfirmButton: false,
    timer: 1500,
  });
};

const WarningToast = (title) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: title,
  });
};

export { SingleToast, WarningToast };
