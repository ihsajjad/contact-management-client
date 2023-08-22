import { useRef, useState } from "react";
import useLoadUserData from "../../hooks/useLoadUserData";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { IoShareSocialSharp } from "react-icons/io5";
import axios from "axios";
import UpdateModal from "../../components/UpdateModal";
import { useForm } from "react-hook-form";
// https://www.npmjs.com/package/react-phone-number-input
const MyContacts = () => {
  const { refetch, userData } = useLoadUserData();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [contactId, setContactId] = useState("");
  const [sharedItems, setSharedItems] = useState([]);
  const [selected, setSelected] = useState(false);
  const isSelected = useRef();

  const {
    register,
    handleSubmit,
    reset,
    // formState: { errors },
  } = useForm();
  /* ======================================== 
           Adding new contact 
  ========================================*/
  const handleAddContact = (data) => {
    const contact = { ...data, tags: [], permissions: [] };

    axios
      .patch(`http://localhost:5000/add-contact/${userData.email}`, { contact })
      .then((res) => {
        if (res.data?.acknowledged) {
          refetch();
          reset();
        }
      })
      .catch((error) => console.log(error.message));
  };

  // console.log(isSelected.current?.value);

  /* ======================================== 
           Deleting contact 
  ========================================*/

  const handleDeleteContact = (id) => {
    axios
      .patch(
        `http://localhost:5000/delete-contact?email=${userData.email}&id=${id}`
      )
      .then((res) => {
        console.log(res.data);
        if (res.data?.acknowledged) {
          refetch();
        }
      })
      .catch((error) => console.log(error.message));
  };

  /* ======================================== 
           Updating contact 
  ========================================*/

  const openModal = (id) => {
    setContactId(id);
    setIsOpenModal(true);
  };

  const handleShare = (item) => {
    const result = sharedItems.filter((sharedItem) => sharedItem === item._id);
    if (result?.length === 1) {
      const exit = sharedItems.filter((sharedItem) => sharedItem !== item._id);
      setSharedItems(exit);
      setSelected(false);
    } else if (result?.length <= 0) {
      setSharedItems((prev) => [...prev, item._id]);
      setSelected(true);
    }
  };

  console.log(sharedItems);

  return (
    <div className="overflow-x-auto md:m-20 bg-slate-300 min-h-screen rounded-lg border border-[var(--main-color)]">
      <form onSubmit={handleSubmit(handleAddContact)}>
        <table className="table rounded-lg md:mb-20">
          {/* head */}
          <thead className="bg-slate-800 text-[var(--main-color)] font-bold text-xl rounded-lg">
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Permissions</th>
              <th>
                <div className="flex items-center justify-center gap-2">
                  <span>Actions</span>
                  {sharedItems.length > 0 && (
                    <span className="custom-btn-outline">
                      <IoShareSocialSharp />
                    </span>
                  )}
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {userData?.contacts &&
              userData.contacts?.map((contact, i) => (
                <tr key={i}>
                  <th>
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox"
                        id={`checkbox-${contact._id}`}
                        onClick={() => handleShare(contact)}
                        ref={isSelected}
                      />
                    </label>
                  </th>
                  <td>{contact.name}</td>
                  <td>{contact.phoneNumber}</td>
                  <td>{contact.email}</td>
                  <td>
                    {sharedItems.includes(contact._id) && (
                      <div className="flex items-center justify-center gap-2">
                        <input type="checkbox" className="checkbox" />{" "}
                        <span>Read-Write</span>
                      </div>
                    )}
                  </td>
                  <th className="inline-flex gap-2">
                    <div
                      onClick={() => handleDeleteContact(contact._id)}
                      className="text-white bg-red-400 hover:bg-red-600 h-8 w-8 rounded-full flex items-center justify-center text-lg"
                    >
                      <FaTrashAlt />
                    </div>
                    <div
                      onClick={() => openModal(contact._id)}
                      className="text-white bg-orange-400 hover:bg-orange-600 h-8 w-8 rounded-full flex items-center justify-center text-lg"
                    >
                      <FaEdit />
                    </div>
                  </th>
                </tr>
              ))}

            {/* empty field to add new contact */}
            <tr>
              <th></th>
              <td>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  {...register("name", { required: true })}
                  className="py-1 px-2 rounded outline-0 mr-2"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  {...register("phoneNumber", { required: true })}
                  className="py-1 px-2 rounded outline-0"
                />
              </td>
              <td>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  {...register("email", { required: true })}
                  className="py-1 px-2 rounded outline-0 mr-2"
                />
              </td>
              <th className="inline-flex gap-2 w-full">
                <button
                  type="submit"
                  className="text-white bg-green-500 hover:bg-green-600 rounded py-1 px-2 w-full"
                >
                  Add
                </button>
              </th>
            </tr>
          </tbody>
        </table>
      </form>
      <UpdateModal
        contactId={contactId}
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
      />
    </div>
  );
};

export default MyContacts;
