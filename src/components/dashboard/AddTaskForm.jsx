import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { forwardRef, useState } from "react";


const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => {
    return (
        <button type="button" className="input input-bordered w-full" onClick={onClick} ref={ref}>
            {value}
        </button>
    )
});

ExampleCustomInput.displayName = 'ExampleCustomInput';

const AddTaskForm = ({ refetchTasks }) => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    // const [startDate, setStartDate] = useState(new Date());
    const [startDate, setStartDate] = useState(
        new Date(),
    );


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
            deadline: startDate,
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
                    {/* <DatePicker customInput={<ExampleCustomInput />}  {...register("deadline")} required selected={startDate} onChange={(date) => setStartDate(date)} /> */}
                    {/* <input {...register("deadline")} type="text" placeholder="Date" className="input input-bordered" required /> */}
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
    );
};

export default AddTaskForm;