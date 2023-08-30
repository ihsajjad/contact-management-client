import { useState } from "react";
import useLoadUserData from "../../hooks/useLoadUserData";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import PermittedUpdateModal from "../../components/PermittedUpdatedModal";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const PermittedContacts = () => {
  const { refetch, userData } = useLoadUserData();
  const [contactId, setContactId] = useState("");
  const [openUpdateModal, setOpenUpdateModal] = useState(false); // to update contact info
  const { axiosSecure } = useAxiosSecure();

  /* ======================================== 
           Deleting contact 
  ========================================*/
  const handleDeleteContact = (id) => {
    axiosSecure
      .patch(`/delete-parmitted-contact?email=${userData?.email}&id=${id}`)
      .then((res) => {
        if (res.data?.acknowledged) {
          refetch();
        }
      })
      .catch((error) => console.log(error.message));
  };

  const openModal = (id) => {
    setContactId(id);
    setOpenUpdateModal(true);
  };

  return (
    <div className="overflow-x-auto md:m-20 bg-slate-300 min-h-screen rounded-lg border border-[var(--main-color)]">
      <table className="table rounded-lg md:mb-20">
        {/* head */}
        <thead className="bg-slate-800 text-[var(--main-color)] font-bold text-xl rounded-lg">
          <tr>
            <th>SL</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Sent By</th>
            <th>Permission</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {userData?.permittedContacts &&
            userData?.permittedContacts?.map((contact, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{contact.name}</td>
                <td>{contact.phoneNumber}</td>
                <td>{contact?.email}</td>
                <td>{contact.from}</td>
                <td>
                  <span
                    className={`${
                      contact.write ? "bg-green-500 " : "bg-red-500"
                    } text-white p-2 rounded-lg`}
                  >
                    {" "}
                    {contact.write ? "Read-Write" : "Read-Only"}
                  </span>
                </td>
                <th className="inline-flex gap-2">
                  <div
                    onClick={() => handleDeleteContact(contact._id)}
                    className="text-white bg-red-400 hover:bg-red-600 h-8 w-8 rounded-full flex items-center cursor-pointer justify-center text-lg"
                  >
                    <FaTrashAlt />
                  </div>
                  <button
                    disabled={!contact.write}
                    onClick={() => openModal(contact._id)}
                    className="text-white bg-orange-400 hover:bg-orange-600 h-8 w-8 rounded-full flex items-center justify-center text-lg cursor-pointer"
                  >
                    <FaEdit />
                  </button>
                </th>
              </tr>
            ))}
        </tbody>
      </table>
      <PermittedUpdateModal
        contactId={contactId}
        openUpdateModal={openUpdateModal}
        setOpenUpdateModal={setOpenUpdateModal}
      />
    </div>
  );
};

export default PermittedContacts;
