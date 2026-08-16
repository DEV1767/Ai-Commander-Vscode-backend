import mongoose from "mongoose";

const analysisResultSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        command: { type: String },
        exitCode: { type: Number },

        raw_text: { type: String },
        error: { type: String },
        description: { type: String },
        risk: { type: String },
        logs: { type: String },
        tech_stack: { type: String },
        explanation: { type: String },
        prevention: { type: String }
    },
    {
        timestamps: true
    }
);

const AnalysisResult = mongoose.model("AnalysisResult", analysisResultSchema);

export default AnalysisResult;