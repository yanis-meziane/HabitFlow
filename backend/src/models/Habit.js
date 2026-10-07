import mongoose from "mongoose"

const habitSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true, minlength: 1, maxlength: 120 },
        frequency: { type: String, enum: ["daily", "weekly"], required: true },
        active: { type: Boolean, required: true },
        // extras (non contractuels) : couleur d'affichage et jours validés "YYYY-MM-DD" (date locale du client)
        color: { type: String, match: /^#[0-9a-f]{6}$/i, default: "#7cb73b" },
        completions: { type: [{ type: String, match: /^\d{4}-\d{2}-\d{2}$/ }], default: [] },
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    },
    {
        timestamps: true,
        // contrat public : `id` (string), jamais `_id` / `__v`
        toJSON: {
            transform: (_doc, ret) => {
                ret.id = String(ret._id);
                ret.ownerId = String(ret.ownerId);
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
)

export const Habit = mongoose.model("Habit", habitSchema)
