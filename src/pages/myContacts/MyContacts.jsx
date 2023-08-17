import { useState } from "react";
import useLoadUserData from "../../hooks/useLoadUserData";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import axios from "axios";
// https://www.npmjs.com/package/react-phone-number-input
const MyContacts = () => {
  const { refetch, userData } = useLoadUserData();
  const [contact, setConatct] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    tags: [],
    permissions: [],
  });

  /* ======================================== 
           Adding new contact 
  ========================================*/
  const handleAddContact = () => {
    // catching the input fields to clean
    const inputs = document.querySelectorAll(
      'input[name="name"], input[name="email"], input[name="number"]'
    );

    axios
      .patch(`http://localhost:5000/add-contact/${userData.email}`, { contact })
      .then((res) => {
        if (res.data?.acknowledged) {
          refetch();

          // cleaning the input fields
          inputs.forEach((input) => (input.value = ""));
        }
      })
      .catch((error) => console.log(error.message));
  };

  /* ======================================== 
           Deleting contact 
  ========================================*/

  const handleDeleteContact = (id) => {
    console.log(id);
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

  return (
    <div className="overflow-x-auto md:m-20 bg-slate-300 min-h-screen rounded-lg border border-[var(--main-color)]">
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userData?.contacts?.map((contact, i) => (
            <tr key={i}>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <td>{contact.name}</td>
              <td>{contact.phoneNumber}</td>
              <td>{contact.email}</td>
              <th className="inline-flex gap-2">
                <button
                  onClick={() => handleDeleteContact(contact._id)}
                  className="text-white bg-red-400 hover:bg-red-600 h-8 w-8 rounded-full flex items-center justify-center text-lg"
                >
                  <FaTrashAlt />
                </button>
                <button className="text-white bg-orange-400 hover:bg-orange-600 h-8 w-8 rounded-full flex items-center justify-center text-lg">
                  <FaEdit />
                </button>
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
                onChange={(e) =>
                  setConatct((prev) => ({ ...prev, name: e.target.value }))
                }
                className="py-1 px-2 rounded outline-0"
              />
            </td>
            <td>
              <input
                type="number"
                name="number"
                placeholder="Phone Number"
                onChange={(e) =>
                  setConatct((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }))
                }
                className="py-1 px-2 rounded outline-0"
              />
            </td>
            <td>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={(e) =>
                  setConatct((prev) => ({ ...prev, email: e.target.value }))
                }
                className="py-1 px-2 rounded outline-0"
              />
            </td>
            <th className="inline-flex gap-2 w-full">
              <button
                onClick={handleAddContact}
                className="text-white bg-green-500 hover:bg-green-600 rounded py-1 px-2 w-full"
              >
                Add
              </button>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MyContacts;
