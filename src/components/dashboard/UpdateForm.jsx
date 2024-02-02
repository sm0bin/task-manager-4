import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-hot-toast";


const UpdateForm = ({ refetchTasks, updateTask, setUpdateTask }) => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const states = ["To Do", "Ongoing", "Completed"];

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        console.log(data);

        const task = {
            ...data,
            email: user.email
        }

        axiosSecure.put(`/tasks/${updateTask._id}`, task)
            .then(res => {
                console.log(res.data);
                toast.success('Task Updated!');
                e.target.reset();
                refetchTasks();
                document.getElementById('updateTaskModal').close();
                setUpdateTask(null);
            }).catch(err => {
                console.log(err);
            })
    }

    return (
        <form onSubmit={handleSubmit} className="card-body p-0">
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Title</span>
                </label>
                <input name="title" defaultValue={updateTask?.title} type="text" placeholder="Task Title" className="input input-bordered" />
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Deadline</span>
                    </label>
                    <input name="deadline"
                        defaultValue={updateTask?.deadline ? new Date(updateTask.deadline).toISOString().split('T')[0] : ''}
                        type="date" placeholder="Date" className="input input-bordered" />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">State</span>
                    </label>
                    <select name="state" className="select select-bordered w-full max-w-xs">
                        {
                            states.map((state, index) => <option key={index} selected={updateTask?.state === state}>{state}</option>)
                        }
                    </select>
                </div>
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Details</span>
                </label>
                <textarea name="details" defaultValue={updateTask?.details} placeholder="Task Details" rows='5' className="textarea textarea-bordered textarea-md w-full"></textarea>
            </div>

            <div className="form-control mt-6">
                <button className="btn btn-neutral">Update</button>
            </div>
        </form>
    );
};

export default UpdateForm;