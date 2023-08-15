import useLoadUserData from "../../hooks/useLoadUserData";

const MyContacts = () => {
  const { users } = useLoadUserData();
  console.log(users);

  return (
    <div className="overflow-x-auto md:m-20 bg-slate-300 min-h-screen">
      <table className="table">
        {/* head */}
        <thead>
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
              <th>
                <button className="btn btn-ghost btn-xs">details</button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyContacts;
