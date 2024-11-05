const TaskModel = require('../modals/task')
const { validationResult } = require('express-validator')

const add_task = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const task = new TaskModel(req.body)
    try {
        await task.save()
        res.status(201).json({ msg: "task added succesfully", task })
    } catch (e) {
        res.status(500).json(e)
    }
}

const get_task = async (req, res) => {
    try {
        const result = await TaskModel.find()
        if (result.length > 0) {
            res.json(result)
        } else {
            res.status(404).json({ msg: "no tasks found" })
        }
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
}

const individual_task = async (req, res) => {
    try {
        const task = await TaskModel.findById(req.params.id)
        if (task) {
            res.json(task)
        } else {
            res.status(404).json({ msg: "task not found" })
        }
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
}

const get_tasks_by_user = async (req, res) => {
    try {
        const tasks = await TaskModel.find({ userId: req.params.userId });
        if (tasks.length > 0) {
            res.json(tasks);
        } else {
            res.status(404).json({ msg: "No tasks found for this user" });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

const edit_task = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const updatedTask = await TaskModel.findByIdAndUpdate(
            req.params.id,
            { title, description, status },
            { new: true }
        );
        if (!updatedTask) {
            return res.status(404).json({ msg: 'Task not found' });
        }
        res.status(200).json({ msg: "updated successfully", updatedTask });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const delete_task = async (req, res) => {
    try {
        const task = await TaskModel.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }
        res.json({ msg: "deleted succesfully" })
    } catch (e) {
        res.status(500).json({ error: error.message });

    }
}

module.exports = {
    add_task,
    get_task,
    individual_task,
    edit_task,
    delete_task,
    get_tasks_by_user
}