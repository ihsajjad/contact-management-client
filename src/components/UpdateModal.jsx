import { useEffect, useState } from "react";
import useLoadUserData from "../hooks/useLoadUserData";
import axios from "axios";
import { useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";

const UpdateModal = ({ contactId, isOpenModal, setIsOpenModal }) => {
  const { refetch, userData } = useLoadUserData();
  const [contact, setConatct] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    tags: [],
    permissions: [],
  });
  const {
    register,
    handleSubmit,
    reset,
    // formState: { errors },
  } = useForm();

  useEffect(() => {
    const loadData = async () => {
      const res = await axios.get(
        `http://localhost:5000/get-contact/${userData?.email}/${contactId}`
      );

      refetch();
      setConatct(res.data);
    };

    loadData();
  }, [contactId, userData?.email, refetch]);

  const handleUpdateContact = (data) => {
    reset();
    console.log("handleUpdateContact", data);

    const newContact = {
      name: data.name,
      phoneNumber: data.phoneNumber,
      email: data.email,
      tags: data.tags,
      permissions: contact.permissions,
      _id: contactId,
    };

    axios
      .patch(`http://localhost:5000/update-contact/${userData?.email}`, {
        contact: newContact,
      })
      .then((res) => {
        if (res.data?.modifiedCount) {
          refetch();
          setIsOpenModal(false);
        }
      })
      .catch((error) => console.log(error.message));
    console.log(contact);
    reset();
    console.log(data);
  };

  return (
    <dialog
      id=""
      className={`${
        isOpenModal ? "fixed flex" : "hidden"
      } top-0 h-full w-full items-center justify-center bg-gray-400 bg-opacity-20`}
    >
      <form
        onSubmit={handleSubmit(handleUpdateContact)}
        method="dialog"
        className=" w-fit h-fit max-w-5xl bg-slate-700 flex items-center justify-center p-3 rounded-lg relative"
      >
        <div className="flex md:flex-row flex-col md:gap-5 justify-between">
          <input
            type="text"
            name="name"
            placeholder="Name"
            defaultValue={contact?.name}
            {...register("name", { required: true })}
            className="py-1 px-2 rounded border-2"
          />
          <input
            type="number"
            name="phoneNumber"
            placeholder="Phone Number"
            defaultValue={contact?.phoneNumber}
            {...register("phoneNumber", { required: true })}
            className="py-1 px-2 rounded border-2"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            defaultValue={contact?.email}
            {...register("email", { required: true })}
            className="py-1 px-2 rounded border-2"
          />
          <button type="submit" className="bg-[var(--main-color)] px-2 rounded">
            Update
          </button>
          <div
            onClick={() => setIsOpenModal(false)}
            className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center px-2 rounded-full bg-red-500 text-white"
          >
            <FaTimes className=" text-2xl font-bold" />
          </div>
        </div>
      </form>
    </dialog>
  );
};

export default UpdateModal;
