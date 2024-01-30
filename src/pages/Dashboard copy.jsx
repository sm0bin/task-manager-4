// import Task from "../components/dashboard/Task";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";
import useLoadDataSecure from "../hooks/useLoadDataSecure";
import { useRef, useState } from "react";
import Swal from "sweetalert2";
import UpdateForm from "../components/dashboard/UpdateForm";
import { useDrag, useDrop } from "react-dnd";
// import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const Dashboard = () => {
    const ref = useRef(null);
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [tasks, isPendingTasks, refetchTasks] = useLoadDataSecure(`/tasks/${user.email}`, "tasks");
    const [updateTask, setUpdateTask] = useState({});
    const states = ["To Do", "Ongoing", "Completed"];

    // const [, drop] = useDrop({
    //     // Accept will make sure only these element type can be droppable on this element
    //     accept: type,
    //     hover(item) {
    //         //   ...
    //     }
    // });


    // const [{ isDragging }, drag] = useDrag(() => ({
    //     // what type of item this to determine if a drop target accepts it
    //     type: type,
    //     // data of the item to be available to the drop methods
    //     item: { id: image.id, index },
    //     // method to collect additional data for drop handling like whether is currently being dragged
    //     collect: (monitor) => {
    //         return {
    //             isDragging: monitor.isDragging(),
    //         };
    //     },
    // }));

    // if (isPendingTasks) {
    //     return <div className="fixed inset-0 w-full h-screen flex items-center justify-center">
    //         <span className="loading loading-spinner loading-lg"></span>
    //     </div>
    // }
    // console.log(task);

    // if (isPendingTasks) return <div>Loading...</div>
    const addItemToSection = (id) => {
        console.log('drop', id);
    }

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'task',
        drop: (item) => addItemToSection(item.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }))

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'task',
        item: { id: tasks?._id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }))



    const {
        register,
        handleSubmit,
        // watch,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {

        const task = {
            ...data,
            email: user.email
        }
        console.log(task);

        axiosSecure.post("/tasks", task)
            .then(res => {
                console.log(res.data);
                toast.success('Task Added!');
                reset();
                refetchTasks();
                document.getElementById('addTaskModal').close();
            })
            .catch(err => {
                console.log(err);
                toast.error(err.message);
            })

    }




    const deleteTask = (_id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/tasks/${_id}`)
                    .then(res => {
                        console.log(res.data);
                        toast.success('Task Deleted!');
                        refetchTasks();
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        });

    }

    const handleUpdateTask = (task) => {
        console.log(task);
        setUpdateTask(task);
        console.log(updateTask);
        if (updateTask) {
            document.getElementById('updateTaskModal').showModal();
        }
    }

    // email
    // title
    // details
    // deadline
    // priority
    // state

    return (
        <div className="min-h-screen bg-base-200 pt-20 px-2">

            {/* Headlines */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-3xl text-neutral">Tasks</h2>

                <button onClick={() => document.getElementById('addTaskModal').showModal()} className="btn btn-neutral">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Task</button>
            </div>

            {/* Tasks */}
            <section ref={drop} className="grid  grid-cols-1 lg:grid-cols-3 gap-4 my-4">
                {
                    states.map(state => {
                        return (
                            <div key={state} className="bg-base-300 rounded-lg">
                                <div className="bg-neutral text-center p-4 rounded-t-lg text-white">
                                    <h3 className="font-bold text-xl">{state}</h3>
                                </div>

                                <div className="p-4 space-y-4">
                                    {
                                        tasks?.map(task => {
                                            if (task.state === state) {
                                                return (
                                                    <div ref={drag} key={task?._id} className={` ${isDragging ? '-rotate-2 cursor-grabbing' : ''} cursor-grab bg-gray-50 rounded-md overflow-hidden group`}>

                                                        <div className="bg-neutral px-4 py-3 flex items-center justify-between gap-6">
                                                            <h4 className="font-semibold text-gray-50 text-lg">{task?.title}</h4>

                                                            <div className="flex">
                                                                <button onClick={() => deleteTask(task._id)} className="btn btn-ghost btn-circle text-transparent group-hover:text-rose-400">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                                        <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                                                    </svg>

                                                                </button>
                                                                <button onClick={() => handleUpdateTask(task)} className="btn btn-ghost btn-circle text-transparent group-hover:text-green-400">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                                                        <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="p-4">
                                                            {task?.details}
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                </div>

                            </div>
                        )
                    })
                }
            </section>

            {/* Add new Task Modal */}
            <dialog key={1} id="addTaskModal" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <form onSubmit={handleSubmit(onSubmit)} className="card-body p-0">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Title</span>
                            </label>
                            <input {...register("title")} type="text" placeholder="Task Title" className="input input-bordered" required />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Priority</span>
                                </label>
                                <select {...register("priority")} className="select select-bordered w-full max-w-xs">
                                    <option selected>Low</option>
                                    <option>Moderate</option>
                                    <option>High</option>
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Deadline</span>
                                </label>
                                <input {...register("deadline")} type="text" placeholder="Date" className="input input-bordered" required />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">State</span>
                                </label>
                                <select {...register("state")} className="select select-bordered w-full max-w-xs">
                                    <option selected>To Do</option>
                                    <option>Ongoing</option>
                                    <option>Completed</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Details</span>
                            </label>
                            <textarea {...register("details", { required: true })} placeholder="Task Details" rows='5' className="textarea textarea-bordered textarea-md w-full" required></textarea>
                            {errors.exampleRequired && <span className="text-rose-500 mt-2">This field is required</span>}
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-neutral">Add</button>
                        </div>
                    </form>

                </div>
            </dialog>

            {/* Update Task Modal */}
            <dialog key={2} id="updateTaskModal" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>

                    <UpdateForm updateTask={updateTask} refetchTasks={refetchTasks} />

                </div>
            </dialog>

        </div>
    );
};

export default Dashboard;