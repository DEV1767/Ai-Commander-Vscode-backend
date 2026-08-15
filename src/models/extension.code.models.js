import mongoose from "mongoose";

const extensionAuthSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        expiresAt: {
            type: Date,
            required: true,
            index: true
        },

        used: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);


extensionAuthSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

const ExtensionAuth = mongoose.model(
    "ExtensionAuth",
    extensionAuthSchema
);

export default ExtensionAuth;