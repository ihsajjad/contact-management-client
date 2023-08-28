import { useEffect, useState } from "react";
import useLoadUserData from "../../hooks/useLoadUserData";
import { FaEdit, FaTimes, FaTrashAlt } from "react-icons/fa";
import { IoShareSocialSharp } from "react-icons/io5";
import axios from "axios";
import UpdateModal from "../../components/UpdateModal";
import { useForm } from "react-hook-form";
import ViewShared from "../../components/ViewShared";
// https://www.npmjs.com/package/react-phone-number-input
const MyContacts = () => {
  const { refetch, userData } = useLoadUserData();
  const [openUpdateModal, setOpenUpdateModal] = useState(false); // to update contact info
  const [openUsersModal, setOpenUsersModal] = useState(false);
  const [openViewSharedModal, setOpenViewSharedModal] = useState(false);
  const [contactId, setContactId] = useState("");
  const [sharedIds, setSharedIds] = useState([]);
  const [sharedContacts, setSharedContacts] = useState([]);
  const [users, setUsers] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    // formState: { errors },
  } = useForm();

  useEffect(() => {
    const loadUsers = async () => {
      const res = await axios.get("http://localhost:5000/all-users");
      const users = res.data.filter((data) => data.email !== userData.email);
      setUsers(users);
    };
    loadUsers();
  }, [userData.email]);

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
    setOpenUpdateModal(true);
  };

  const viewShareModal = (id) => {
    setContactId(id);
    setOpenViewSharedModal(true);
  };

  const handleSelectForShare = (item) => {
    const shareContact = {
      _id: item._id,
      name: item.name,
      email: item.email,
      phoneNumber: item.phoneNumber,
      from: userData.email,
      write: false,
    };

    const result = sharedIds.filter((sharedItem) => sharedItem === item._id);
    if (result?.length === 1) {
      const exit = sharedIds.filter((sharedItem) => sharedItem !== item._id);
      setSharedIds(exit);

      // clearing background red color after unchecking
      const row = document.querySelector(`#contact-${item._id}`);
      row.style.backgroundColor = "";
      row.style.color = "";
    } else if (result?.length <= 0) {
      setSharedIds((prev) => [...prev, item._id]);
    }

    const sharedArray = sharedContacts.filter(
      (sharedItem) => sharedItem._id === item._id
    );
    if (sharedArray?.length === 1) {
      const exit = sharedContacts.filter(
        (sharedItem) => sharedItem._id !== item._id
      );
      setSharedContacts(exit);
    } else if (sharedArray?.length <= 0) {
      setSharedContacts((prev) => [...prev, shareContact]);
    }
  };

  const handleWritePermission = (id) => {
    const contact = sharedContacts.find((item) => item._id === id);
    if (contact.write) {
      contact.write = false;
    } else {
      contact.write = true;
    }
  };

  const handleShare = async (user) => {
    let alreadyShareds = 0;

    sharedContacts.forEach((sharedContact) => {
      const contact = userData?.contacts?.find(
        (item) => item._id === sharedContact._id
      );
      const exist = contact?.tags?.find((tag) => tag.email === user.email);

      if (exist) {
        userData.contacts.find((contact) => contact._id === exist._id);
        alreadyShareds = alreadyShareds + 1;

        // highliting already shared contact with red background
        const element = document.getElementById(`contact-${exist?._id}`);
        element.style.backgroundColor = "red";
        element.style.color = "white";
      }
    });

    // returning a warning if there is any alread shared contact
    if (alreadyShareds > 0) {
      return alert("Already Shared");
    }

    console.log("running...");

    const res = await axios.patch(
      `http://localhost:5000/share-contacts/${user?.email}`,
      {
        sharedContacts,
      }
    );

    if (res?.data.modifiedCount > 0) {
      // Removing red background after successfull share
      const elements = document.querySelectorAll(`.contact`);
      elements.forEach((element) => {
        element.style.backgroundColor = "";
        element.style.color = "";
      });

      // holding shared info for each contact
      sharedContacts.forEach(async (item) => {
        await axios.patch(
          `http://localhost:5000/set-shared-info/${userData?.email}/${item?._id}`,
          {
            name: user.name,
            email: user.email,
            write: item.write,
            _id: item._id,
          }
        );
      });

      refetch();
    }
  };

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
                  {sharedIds.length > 0 && (
                    <span
                      onClick={() => setOpenUsersModal(true)}
                      className="custom-btn-outline"
                    >
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
                <tr key={i} id={`contact-${contact._id}`} className="contact">
                  <th>
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox"
                        id={`checkbox-${contact._id}`}
                        onClick={() => handleSelectForShare(contact)}
                      />
                    </label>
                  </th>
                  <td>{contact.name}</td>
                  <td>{contact.phoneNumber}</td>
                  <td>{contact.email}</td>
                  <td className="text-left">
                    {sharedIds.includes(contact._id) ? (
                      <div className="flex items-center  gap-2">
                        <input
                          type="checkbox"
                          onChange={() => handleWritePermission(contact._id)}
                          className="checkbox"
                        />{" "}
                        <span>Write</span>
                      </div>
                    ) : (
                      <div className="flex items-center  gap-2">
                        <span
                          onClick={() => viewShareModal(contact._id)}
                          className="bg-slate-500 text-white p-2 rounded-lg cursor-pointer"
                        >
                          View Shared
                        </span>
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

      {/* Contact Update modal */}
      <UpdateModal
        contactId={contactId}
        openUpdateModal={openUpdateModal}
        setOpenUpdateModal={setOpenUpdateModal}
      />

      <ViewShared
        contactId={contactId}
        openViewSharedModal={openViewSharedModal}
        setOpenViewSharedModal={setOpenViewSharedModal}
      />

      {/*  ================================================================ 
                                  All users modal 
      ================================================================ */}
      <div
        className={`${
          openUsersModal ? "fixed flex" : "hidden"
        } top-0 left-0 h-full w-full items-center justify-center bg-gray-400 bg-opacity-50`}
      >
        <div className=" w-fit m-auto h-fit max-w-5xl bg-slate-700 flex flex-col items-center justify-center gap-2 p-3 rounded-lg relative">
          <div className="overflow-x-auto">
            <table className="table text-white">
              {/* head */}
              <thead>
                <tr className="text-white">
                  <th>SL</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>

              {/* table body */}
              <tbody>
                {users.map((user, i) => (
                  <tr key={user._id}>
                    <td>{i + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <th>
                      <button
                        type="submit"
                        onClick={() => handleShare(user)}
                        className="bg-[var(--main-color)] px-2 rounded"
                      >
                        Share
                      </button>
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            onClick={() => setOpenUsersModal(false)}
            className="absolute -top-2 -right-2 h-8 w-8 text-xl flex items-center justify-center px-2 rounded-full bg-red-500 text-white"
          >
            <FaTimes className=" text-2xl font-bold" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyContacts;
