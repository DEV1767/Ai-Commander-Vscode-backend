import AnalysisResult from "../models/analysis.model.js"


export const AnalyseError = async (req, res) => {
    try {
        const userId = req.userId
        const { log, command, exitcode } = req.body

        if (!log) {
            return res.status(400).json({
                success: false,
                message: "Log content is required"
            })
        }
        const url = "https://ai-commander-psi.vercel.app/analyze"

        const aiResponce = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ log })
        })

        const result = await aiResponce.json() 
        if (!aiResponce.ok || !result) {
            return res.status(502).json({
                success: false,
                message: "AI analysis service failed to respond"
            })
        }
        const saved = await AnalysisResult.create({
            userId,
            command,
            exitCode,
            raw_text: result.raw_text,
            error: result.error,
            description: result.description,
            risk: result.risk,
            logs: result.logs,
            tech_stack: result.tech_stack,
            explanation: result.explanation,
            prevention: result.prevention
        })

        return res.status(200).json({
            success: true,
            ...result,
            id: saved._id
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to analyze error"
        })

    }
}

export const getVscodeErrors = async (req, res) => {
    try {
        const userId = req.userId

        const results = await AnalysisResult.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50)

        return res.status(200).json(results)

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to fetch VS Code errors"
        })
    }
}