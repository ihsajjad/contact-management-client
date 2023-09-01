import { useContext, useEffect, useState } from "react";
import useLoadUserData from "../../hooks/useLoadUserData";
import { FaEdit, FaTimes, FaTrashAlt } from "react-icons/fa";
import { IoShareSocialSharp } from "react-icons/io5";
import UpdateModal from "../../components/UpdateModal";
import { useForm } from "react-hook-form";
import ViewShared from "../../components/ViewShared";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { SingleToast, WarningToast } from "../../utils/modals";
import Swal from "sweetalert2";
import { AuthContext } from "../../providers/AuthProviders";
// https://www.npmjs.com/package/react-phone-number-input
const MyContacts = () => {
  const { loading } = useContext(AuthContext);
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
  const { axiosSecure } = useAxiosSecure();

  useEffect(() => {
    const loadUsers = async () => {
      const res = await axiosSecure.get("/all-users");
      const users = res.data.filter((data) => data.email !== userData.email);
      setUsers(users);
    };
    if (!loading) {
      loadUsers();
    }
  }, [userData.email, loading]);

  /* ======================================== 
           Adding new contact 
  ========================================*/
  const handleAddContact = async (data) => {
    const contact = { ...data, tags: [], permissions: [] };

    await axiosSecure
      .patch(`/add-contact/${userData?.email}`, {
        contact,
      })
      .then((res) => {
        if (res.data?.acknowledged) {
          SingleToast("Added New Contact");
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
    // asking before deleting contact
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // deleting contact after confirm
        axiosSecure
          .patch(`/delete-contact?email=${userData.email}&id=${id}`)
          .then((res) => {
            if (res.data?.acknowledged) {
              refetch();
            }
          })
          .catch((error) => console.log(error.message));
        Swal.fire("Deleted!", "Your contact has been deleted.", "success");
      }
    });
  };

  // opening update modal
  const openModal = (id) => {
    setContactId(id);
    setOpenUpdateModal(true);
  };

  const viewShareModal = (id) => {
    setContactId(id);
    setOpenViewSharedModal(true);
  };

  /* ======================================== 
           selecting contacts to share 
  ========================================*/
  const handleSelectForShare = (item) => {
    // re-creating the contact with extra info to share
    const shareContact = {
      _id: item._id,
      name: item.name,
      email: item.email,
      phoneNumber: item.phoneNumber,
      from: userData.email,
      write: false,
    };

    // taking and removing shared contact's id depending on check and uncheck
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

  // setting default permission
  const handleWritePermission = (id) => {
    const contact = sharedContacts.find((item) => item._id === id);
    if (contact.write) {
      contact.write = false;
    } else {
      contact.write = true;
    }
  };

  /* ======================================== 
           Shareing contacts with other users 
  ========================================*/
  const handleShare = async (user) => {
    let alreadyShareds = 0;

    // checking already shared or not
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
        element.style.backgroundColor = "#ff6d6d";
        element.style.color = "white";
      }
    });

    // returning a warning if there is any already shared contact
    if (alreadyShareds > 0) {
      return WarningToast("Uncheck already shared contacts with this user");
    }

    const res = await axiosSecure.patch(`/share-contacts/${user?.email}`, {
      sharedContacts,
    });

    if (res?.data.modifiedCount > 0) {
      SingleToast("Contacts has been shared");

      // Removing red background after successfull share
      const elements = document.querySelectorAll(`.contact`);
      elements.forEach((element) => {
        element.style.backgroundColor = "";
        element.style.color = "";
      });

      // holding shared info for each contact
      sharedContacts.forEach(async (item) => {
        await axiosSecure.patch(
          `/set-shared-info/${userData?.email}/${item?._id}`,
          {
            name: user.name,
            email: user.email,
            write: item.write,
            _id: item._id,
          }
        );
      });

      // sending notification
      axiosSecure.patch(`/send-notification/${user?.email}`, {
        senderName: userData.name,
        message: `You got new contacts`,
        read: false,
      });

      refetch();
    }
  };

  return (
    <div className="overflow-x-auto md:m-20 m-2 bg-slate-300 min-h-screen rounded-lg border border-[var(--main-color)]">
      <form onSubmit={handleSubmit(handleAddContact)}>
        <table className="table rounded-lg md:mb-20">
          {/* head */}
          <thead className="bg-slate-800 text-[var(--main-color)] font-bold text-xl rounded-lg">
            <tr>
              <th>
                {sharedIds.length > 0 && (
                  <span
                    onClick={() => setOpenUsersModal(true)}
                    className="custom-btn-outline text-2xl cursor-pointer"
                  >
                    <IoShareSocialSharp />
                  </span>
                )}
              </th>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Permissions</th>
              <th>
                <div className="flex items-center justify-center gap-2">
                  <span>Actions</span>
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {userData?.contacts ? (
              userData.contacts?.map((contact, i) => (
                <tr key={i} id={`contact-${contact._id}`} className="contact">
                  <th className="">
                    <label className="lg:tooltip" data-tip="Select">
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
                          className="bg-slate-500 text-white py-1 px-2 rounded-lg cursor-pointer text-sm"
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
              ))
            ) : (
              <tr>
                <td>Loading...</td>
              </tr>
            )}

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

      {/* view shared of individual contact */}
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
