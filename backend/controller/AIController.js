const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");

const AuditPlan = require('../models/AIAuditModel')


const apiKey = process.env.AI_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const prompt = async (req, res) => {
    try {
      const { auditorName, auditTitle } = req.body;
  
      if (!auditorName || !auditTitle) {
        return res.status(400).json({ error: "Auditor Name and Audit Title are required." });
      }
  
      const chatSession = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [
              {
                text: `Generate an audit plan for the product titled "${auditTitle}". Assign it to "${auditorName}". Respond only with JSON. Include the following fields:
                - AuditName
                - Scope
                - ScheduledDate
                - Priority
                - Status
                - AuditType
                - NotificationsSent
                - ExpectedCompletionDate`,
              },
            ],
          },
        ],
      });
  
      const result = await chatSession.sendMessage(
        `Generate an audit plan for the product titled "${auditTitle}". Assign it to "${auditorName}". and also can you make the ExpectedCompletionDate to only 10 days or 15 days`
      );
  
      const responseText = result.response?.text
        ? await result.response.text()
        : String(result.response);
      
  
      const jsonMatch = responseText.match(/({.*})/s); 
      if (jsonMatch && jsonMatch[1]) {
        const generatedPlan = JSON.parse(jsonMatch[1]);
  
        // Transform data to match schema
        const auditPlanData = {
          AuditName: generatedPlan.AuditName || auditTitle,
          AssignedAuditor: generatedPlan.AssignedTo || auditorName,
          Scope: generatedPlan.Scope || "Default audit scope description",
          ScheduledDate: generatedPlan.ScheduledDate || new Date(),
          Priority: generatedPlan.Priority || "Medium",
          Status: generatedPlan.Status || "Scheduled",
          AuditType: validateAuditType(generatedPlan.AuditType),
          NotificationsSent: !!generatedPlan.NotificationsSent, // Ensure boolean type
          ExpectedCompletionDate: generatedPlan.ExpectedCompletionDate || new Date(),
          Checklist: generatedPlan.Checklist,
        };
  
        // Save to database
        const savedAuditPlan = await AuditPlan.create(auditPlanData);
        res.json({ success: true, auditPlan: savedAuditPlan });
      } else {
        throw new Error("Failed to extract JSON from AI response.");
      }
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  };
  
  // Helper function to validate AuditType
  const validateAuditType = (auditType) => {
    const validTypes = ['Security', 'Performance', 'Compliance', 'Operational', 'Product Audit'];
    return validTypes.includes(auditType) ? auditType : 'Operational'; // Default to 'Operational'
  };


  const showAllAuditPlan = async (req, res) => {
    try {
        const adutiPlan = await AuditPlan.find();
        res.status(200).json(adutiPlan);
    } catch (error) {
        console.error('Error fetching Audit:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
  
module.exports = {
    prompt,
    showAllAuditPlan
}