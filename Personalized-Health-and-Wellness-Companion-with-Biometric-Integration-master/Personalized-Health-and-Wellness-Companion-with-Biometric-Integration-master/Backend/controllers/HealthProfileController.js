
const HealthProfile = require("../models/HealthProfile");
const {GoogleGenerativeAI} =require("@google/generative-ai");
require("dotenv").config();
const genAI =new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.createHealthProfile = async (req, res) => {
  try {
    const userId = req.userId;

    console.log("🧍‍♂️ Creating profile for user:", userId);

    // Create a new profile always for each user
    const profile = new HealthProfile({ ...req.body, userId });
    await profile.save();

    console.log("✅ New profile created:", profile._id);

    // ✅ Optionally generate AI insight immediately
   // await generateAI(profile);

   const prompt = `
   You are a health and wellness AI expert.
   Based on this user's health data, generate personalized insights.
   
   Name: ${profile.name}
   Age: ${profile.age}
   Gender: ${profile.gender}
   Height: ${profile.height} cm
   Weight: ${profile.weight} kg
   Goal: ${profile.goal}
   Activity: ${profile.activity}
   Sleep Hours: ${profile.sleep}
   Stress Level: ${profile.stress}
   
   Respond in this structured format:
   Workout Plan:
   Nutrition Plan:
   Mindfulness Tips:
   `;
   
       const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
       const result = await model.generateContent(prompt);
       const aiText = result.response.text();
   
       // Save AI recommendations
       profile.aiRecommendations = {
         workouts: aiText,
         dietPlan: aiText,
         mindfulness: aiText,
       };
       await profile.save();
   
       res.status(201).json({
         success: true,
         message: "Profile saved and AI insights generated successfully.",
         profile,
       });
     } catch (error) {
       console.error("❌ Error in createHealthProfile:", error);
       res.status(400).json({ success: false, message: error.message });
     }};


exports.getUserHealthProfile = async (req, res) => {
  try {
    const profile = await HealthProfile.findOne({ userId: req.userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.generateAIInsights = async (req, res) => {
  try {
    const profile = await HealthProfile.findOne({ userId: req.userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const prompt = `
You are a health and wellness AI expert. 
Based on this user's data, give personalized insights.

Name: ${profile.name}
Age: ${profile.age}
Gender: ${profile.gender}
Height: ${profile.height} cm
Weight: ${profile.weight} kg
Goal: ${profile.goal}
Activity: ${profile.activity}
Sleep Hours: ${profile.sleep}
Stress Level: ${profile.stress}

Please respond in this structured format:
Workout Plan:
Nutrition Plan:
Mindfulness Tips:
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const aiText = result.response.text();

    const recommendations = {
      workouts: aiText,
      dietPlan: aiText,
      mindfulness: aiText,
    };

    // ✅ Always create a new document (don’t findOne)
    const newProfile = await HealthProfile.create({
      userId,
      name,
      age,
      gender,
      height,
      weight,
      goal,
      activity,
      sleep,
      stress,
      aiRecommendations: recommendations,
    });

    res.status(201).json({ success: true,newProfile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving profile" });
  }};


  // 🧠 Get AI insights for the logged-in user
exports.getUserInsights = async (req, res) => {
  try {
    const userId = req.userId; // from token middleware

    // find user’s health profile
    const profile = await HealthProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "Health profile not found" });
    }

    // if AI recommendations exist, send them
    if (profile.aiRecommendations && Object.keys(profile.aiRecommendations).length > 0) {
      return res.status(200).json({
        success: true,
        aiRecommendations: profile.aiRecommendations,
      });
    }

    // if no recommendations yet
    return res.status(200).json({
      success: false,
      message: "AI insights not yet generated. Please generate them first.",
      aiRecommendations: null,
    });
  } catch (err) {
    console.error("Error fetching insights:", err);
    res.status(500).json({ message: "Server error while fetching insights" });
  }
};
/*
exports.getUserProfiles = async (req, res) => {
  try {
    const userId = req.user._id;
    const profiles = await HealthProfile.find({ userId }).sort({ createdAt: -1 });
    res.json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching profiles" });
  }
}; */
