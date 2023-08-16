import useLoadUserData from "../../hooks/useLoadUserData";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
// https://www.npmjs.com/package/react-phone-number-input
const MyContacts = () => {
  const { users } = useLoadUserData();

  return (
    <div className="overflow-x-auto md:m-20 bg-slate-300 min-h-screen rounded-lg border border-[var(--main-color)]">
      <table className="table rounded-lg">
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
          {users[0]?.contacts?.map((contact, i) => (
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
                <button className="text-white bg-red-400 hover:bg-red-600 h-8 w-8 rounded-full flex items-center justify-center text-lg">
                  <FaTrashAlt />
                </button>
                <button className="text-white bg-orange-400 hover:bg-orange-600 h-8 w-8 rounded-full flex items-center justify-center text-lg">
                  <FaEdit />
                </button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyContacts;
