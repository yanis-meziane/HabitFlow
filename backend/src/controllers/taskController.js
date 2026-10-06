import * as taskService from "../services/taskService.js";

export async function getAllTasks(req, res) {
    const tasks = await taskService.listTasks(req.userId, req.query);
    return res.status(200).json({ message: "Tâches récupérées", tasks });
}