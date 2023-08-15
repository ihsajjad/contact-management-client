import useLoadUserData from "../hooks/useLoadUserData";

const MyContacts = () => {
  const { users } = useLoadUserData();
  console.log(users);

  return (
    <div>
      <h3>This is home page</h3>
    </div>
  );
};

export default MyContacts;
