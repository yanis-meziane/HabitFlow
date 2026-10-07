import mongoose from "mongoose"

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/

const habitSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, maxlength: 120 },
        frequency: { type: String, enum: ["Quotidien", "Hebdomadaire"], default: "Quotidien" },
        color: { type: String, match: /^#[0-9a-f]{6}$/i, default: "#7cb73b" },
        // jours validés au format "YYYY-MM-DD" (date locale du client), base du calendrier et des séries
        completions: { type: [{ type: String, match: DATE_KEY }], default: [] },
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    },
    { timestamps: true }
)

export const Habit = mongoose.model("Habit", habitSchema)
export { DATE_KEY }
