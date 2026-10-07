import mongoose from "mongoose"

const habitSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, maxlength: 120 },
        frequency: { type: String, enum: ["Quotidien", "Hebdomadaire"], default: "Quotidien" },
        // ponytail: 7 booleans L→D pour la semaine courante, pas d'historique ni de reset hebdo
        done: { type: [Boolean], default: () => Array(7).fill(false), validate: (a) => a.length === 7 },
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    },
    { timestamps: true }
)

export const Habit = mongoose.model("Habit", habitSchema)
