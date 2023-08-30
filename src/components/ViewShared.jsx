import React, { useContext, useState } from "react";
import { FaEdit, FaTimes, FaTrashAlt } from "react-icons/fa";
import { AuthContext } from "../providers/AuthProviders";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";

const ViewShared = ({
  contactId,
  openViewSharedModal,
  setOpenViewSharedModal,
}) => {
  const { user } = useContext(AuthContext);
  const [updatedContact, setUpdatedContact] = useState({});
  const { axiosSecure } = useAxiosSecure();
  const { refetch, data: tags = [] } = useQuery(
    ["tags"],
    () =>
      axiosSecure
        .get(`/get-contact/${user?.email}/${contactId}`)
        .then((res) => res?.data?.tags),
    {
      enabled: openViewSharedModal,
    }
  );

  const handleDeleteShared = (item) => {
    console.log(item);

    // Deleting contact from permitted user
    axiosSecure
      .patch(`/delete-parmitted-contact?email=${item?.email}&id=${item?._id}`)
      .then((res) => {
        console.log(res.data);
        if (res.data?.matchedCount > 0) {
          // Deleting shared info form individual contact's tags info
          axiosSecure
            .patch(`/delete-shared-info/${user?.email}/${item?._id}`)
            .then((res) => {
              console.log(res.data);
              if (res.data?.acknowledged) {
                refetch();
              }
            })
            .catch((error) => console.log(error.message));
        }
      })
      .catch((error) => console.log(error.message));
  };

  const handleEditPermission = (item) => {
    console.log(updatedContact);
    axiosSecure
      .patch(`/update-permission/${item?.email}`, {
        contact: updatedContact,
      })
      .then((res) => {
        if (res.data?.modifiedCount) {
          console.log("or kiya ho gaya");
          refetch();
          axiosSecure
            .patch(
              `/updating-permissin-shared-info/${user?.email}/${item?._id}`,
              {
                info: updatedContact,
              }
            )
            .then((res) => console.log(res.data));
        }
      })
      .catch((error) => console.log(error.message));
  };

  return (
    <div
      className={`${
        openViewSharedModal ? "fixed flex" : "hidden"
      } top-0 left-0 h-full w-full items-center justify-center bg-gray-400 bg-opacity-50`}
    >
      <div className=" max-h-[50vh] m-auto md:w-full max-w-5xl bg-slate-700 flex flex-col items-center justify-center gap-2 p-3 rounded-lg relative">
        <div className=" h-full w-full overflow-y-scroll">
          <table className="table text-white">
            {/* head */}
            <thead className="sticky top-0 bg-slate-700">
              <tr className="text-white">
                <th>SL</th>
                <th>Name</th>
                <th>Email</th>
                <th>Permission</th>
                <th>Action</th>
              </tr>
            </thead>

            {/* table body */}
            <tbody>
              {tags?.map((item, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{item?.name}</td>
                  <td>{item.email}</td>
                  <td>
                    <select
                      name=""
                      id=""
                      defaultValue={item.write}
                      className="text-black"
                      onChange={(e) =>
                        setUpdatedContact(
                          item,
                          (item.write =
                            e.target.value === "true" ? true : false)
                        )
                      }
                    >
                      <option value={false}>Read-Only</option>
                      <option value={true}>Read-Write</option>
                    </select>
                  </td>
                  <th className="inline-flex gap-2">
                    <div
                      onClick={() => handleDeleteShared(item)}
                      className="text-white bg-red-400 hover:bg-red-600 h-8 w-8 rounded-full flex items-center cursor-pointer justify-center text-lg"
                    >
                      <FaTrashAlt />
                    </div>
                    <button
                      type="submit"
                      onClick={() => handleEditPermission(item)}
                      className="text-white bg-orange-400 hover:bg-orange-600 h-8 w-8 rounded-full flex items-center justify-center text-lg"
                    >
                      <FaEdit />
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          onClick={() => setOpenViewSharedModal(false)}
          className="absolute -top-2 -right-2 h-8 w-8 text-xl flex items-center justify-center px-2 rounded-full bg-red-500 text-white"
        >
          <FaTimes className=" text-2xl font-bold" />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ViewShared);
