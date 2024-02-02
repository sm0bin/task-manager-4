import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";


const AddTaskForm = ({ refetchTasks }) => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const {
        register,
        handleSubmit,
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


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="card-body p-0">
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Title</span>
                </label>
                <input {...register("title")} type="text" placeholder="Task Title" className="input input-bordered" required />
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Deadline</span>
                    </label>
                    <input {...register("deadline")} type="date" placeholder="Date" className="input input-bordered" required />
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
            </div>

            <div className="form-control mt-6">
                <button className="btn btn-neutral">Add</button>
            </div>
        </form>
    );
};

export default AddTaskForm;