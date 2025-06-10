import { useEffect, useState } from "react";
import { GoX } from "react-icons/go";
import Swal from 'sweetalert2';


export default function AllUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("http://localhost:3000/getalluser");
                const data = await res.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This will delete the user and all related products.',
            icon: 'warning',
            iconColor: '#007762',
            showCancelButton: true,
            confirmButtonColor: '#007762',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`http://localhost:3000/deleteuser/${id}`, {
                    method: "DELETE",
                });

                const data = await res.json();

                if (res.ok) {
                    Swal.fire({
                        title: 'Deleted!',
                        text: data.message,
                        icon: 'success',
                        iconColor: '#007762',
                        confirmButtonColor: '#007762'
                    });
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: data.message || "Error deleting user.",
                        icon: 'error',
                        iconColor: '#007762',
                        confirmButtonColor: '#007762'
                    });
                }
            } catch (error) {
                console.error("Error deleting user:", error);
                Swal.fire({
                    title: 'Error!',
                    iconColor: '#007762',
                    text: 'Something went wrong while deleting.',
                    icon: 'error',
                    confirmButtonColor: '#007762'
                });
            }
        }
    };


    return (
        <section className='w-[95%] lg:w-[80%] mx-auto my-[80px] min-h-screen'>
            {
                users.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-[700px] w-full border border-gray-300 ">
                            <thead className="bg-[#007762] text-white">
                                <tr >
                                    <th className="p-3 border font-semibold">ID</th>
                                    <th className="p-3 border font-semibold">Image</th>
                                    <th className="p-3 border font-semibold">Name</th>
                                    <th className="p-3 border font-semibold">Email</th>
                                    <th className="p-3 border font-semibold">Created At</th>
                                    <th className="p-3 border font-semibold">Delete User</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="text-center">
                                        <td className="p-3 border">{user.id}</td>
                                        <td className="p-3 border">
                                            <img
                                                src={`http://localhost:3000${user.userimg}`}
                                                alt={user.name}
                                                className="w-12 h-12 rounded-full object-cover mx-auto hover:scale-110 duration-500"
                                            />
                                        </td>
                                        <td className="p-3 border">{user.name}</td>
                                        <td className="p-3 border">{user.email}</td>
                                        <td className="p-3 border">{user.createdat}</td>
                                        <td className="p-3 border ">
                                            <button onClick={() => handleDelete(user.id)}>
                                                <GoX className="text-center mx-auto text-[30px] text-[#007762] hover:rotate-90 duration-500" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No User found </p>
                )
            }
        </section>
    );
}
