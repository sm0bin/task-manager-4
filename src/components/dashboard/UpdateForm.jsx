import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import { forwardRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



const UpdateForm = ({ updateTask, refetchTasks, startDate, setStartDate }) => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const states = ["To Do", "Ongoing", "Completed"];
    const priorities = ["Low", "Moderate", "High"];
    // const [startDate, setStartDate] = useState(updateTask?.deadline);
    // const [startDate, setStartDate] = useState(
    //     setHours(setMinutes(new Date(updateTask?.deadline), 30), 16),
    // );
    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => {
        return (
            <button type="button" className="input input-bordered w-full" onClick={onClick} ref={ref}>
                {value}
            </button>
        )
    });

    ExampleCustomInput.displayName = 'ExampleCustomInput';
    console.log(updateTask);



    const handleSubmit = (e) => {
        e.preventDefault();
        const task = {
            title: e.target.title.value,
            priority: e.target.priority.value,
            deadline: startDate,
            state: e.target.state.value,
            details: e.target.details.value,
            email: user.email
        }
        console.log(task);
        console.log(updateTask._id);

        axiosSecure.put(`/tasks/${updateTask._id}`, task)
            .then(res => {
                console.log(res.data);
                toast.success('Task Updated!');
                e.target.reset();
                refetchTasks();
                document.getElementById('updateTaskModal').close();
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
            <div className="grid grid-cols-3 gap-2">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Priority</span>
                    </label>
                    <select name="priority" defaultValue={updateTask?.priority} className="select select-bordered w-full max-w-xs">
                        {
                            priorities.map((priority, index) => <option key={index} selected={updateTask?.priority === priority}>{priority}</option>)
                        }
                    </select>
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Deadline</span>
                    </label>
                    {/* <DatePicker
                        customInput={<ExampleCustomInput />}
                        selected={startDate} onChange={(date) => setStartDate(date)} /> */}

                    <DatePicker
                        customInput={<ExampleCustomInput />}
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        // locale="pt-BR"
                        showTimeSelect
                        timeFormat="p"
                        timeIntervals={15}
                        // dateFormat="Pp"
                        dateFormat="dd/MM/yyyy hh:mm a"
                    />
                    {/* <input name="deadline" defaultValue={updateTask?.deadline} type="text" placeholder="Date" className="input input-bordered" /> */}
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