// import Task from "../components/dashboard/Task";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";
import useLoadDataSecure from "../hooks/useLoadDataSecure";
import Swal from "sweetalert2";
import UpdateForm from "../components/dashboard/UpdateForm";
import { useDrag, useDrop } from "react-dnd";
import { useState } from "react";
import AddTaskForm from "../components/dashboard/AddTaskForm";
import { setHours, setMinutes } from "date-fns";
// import { set } from "react-hook-form";



const Dashboard = () => {
    const { user } = useAuth();
    const [updateTask, setUpdateTask] = useState({});
    const [tasks, isPendingTasks, refetchTasks] = useLoadDataSecure(`/tasks/${user.email}`, "tasks");
    const states = ["To Do", "Ongoing", "Completed"];
    const [startDate, setStartDate] = useState(
        setHours(setMinutes(new Date(), 30), 16),
    );

    const handleUpdateTask = (task) => {
        console.log(task);
        setStartDate(new Date(task.deadline));
        task.deadline = startDate;
        setUpdateTask(task);
        console.log(updateTask);
        if (updateTask) {
            document.getElementById('updateTaskModal').showModal();
        }
    }

    return (
        <div className="h-screen overflow-y-auto bg-slate-50 pt-20 pb-8 px-4">
            {/* <div className="overflow-y-auto"> */}

            {/* Add button */}
            <button onClick={() => document.getElementById('addTaskModal').showModal()} className="fixed bottom-12 right-12 btn btn-circle btn-lg btn-neutral ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>

            {/* Tasks Section */}
            <section className="grid  grid-cols-1 lg:grid-cols-3 gap-4 my-4">
                {
                    states.map(state => {
                        return (
                            <Section key={state} state={state} tasks={tasks} refetchTasks={refetchTasks} handleUpdateTask={handleUpdateTask} />
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

                    <AddTaskForm refetchTasks={refetchTasks} />

                </div>
            </dialog>

            {/* Update Task Modal */}
            <dialog key={2} id="updateTaskModal" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <UpdateForm refetchTasks={refetchTasks} updateTask={updateTask} startDate={startDate} setStartDate={setStartDate} />
                </div>
            </dialog>

        </div>
        // </div >
    );
};



const Section = ({ state, tasks, refetchTasks, handleUpdateTask }) => {
    const axiosSecure = useAxiosSecure();

    const addItemToSection = (item) => {
        // console.log('drop', id);

        if (item.state !== state) {
            axiosSecure.put(`/tasks/${item.id}`, { ...item, state: state })
                .then(res => {
                    console.log(res.data);
                    toast.success('Task Updated!');
                    refetchTasks();
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'task',
        drop: (item) => addItemToSection(item),
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }))


    return (
        <section className="flex flex-col">
            <div className="bg-neutral text-center p-4 rounded-t-lg text-white">
                <h3 className="font-bold text-xl">{state}</h3>
            </div>

            <div ref={drop} className={`p-4 space-y-4 grow bg-slate-100 rounded-b-lg ${isOver ? 'border border-dashed border-slate-700' : ''}`}>
                {
                    tasks?.map(task => {
                        if (task.state === state) {
                            return (
                                <Task key={task._id} task={task} refetchTasks={refetchTasks} handleUpdateTask={handleUpdateTask} />
                            )
                        }
                    })
                }
            </div>
        </section>
    )
}


const Task = ({ task, refetchTasks, handleUpdateTask }) => {
    const axiosSecure = useAxiosSecure();


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



    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'task',
        item: { id: task?._id, state: task?.state },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }))

    return (
        <div ref={drag} key={task?._id} className={`border ${isDragging ? 'opacity-30 cursor-grabbing' : ''} cursor-grab bg-gray-50 rounded-md overflow-hidden group`}>

            <div className="border-b px-4 py-2 flex items-center justify-between gap-6">
                <h4 className="font-semibold text-gray-600 text-xl">{task?.title}</h4>

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

            <div className="p-4 text-gray-500">
                {task?.details}
            </div>
        </div>
    )
}

export default Dashboard;

// email
// title
// details
// deadline
// priority
// state