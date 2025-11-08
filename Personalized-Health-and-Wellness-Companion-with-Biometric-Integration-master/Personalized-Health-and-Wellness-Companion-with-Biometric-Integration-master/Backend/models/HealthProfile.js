const mongoose =require("mongoose");

const HealthProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // link to User model (if you have authentication)
      required: false,
     
    },

    // Basic Info
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 1,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: false,
    },

    // Physical Stats
    height: {
      type: Number, // in cm
      required: true,
      min: 50,
    },
    weight: {
      type: Number, // in kg
      required: true,
      min: 20,
    },

    // Lifestyle Info
    goal: {
      type: String,
      enum: ["weight_loss", "muscle_gain", "mental_wellness", "balanced_fitness"],
      required: false,
    },
    activity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: false,
    },
    sleep: {
      type: Number, // hours per day
      min: 0,
      max: 24,
      default: 7,
    },
    stress: {
      type: Number, // scale 1-10
      min: 1,
      max: 10,
      default: 5,
    },

    // AI recommendations (optional field to be filled later)
    aiRecommendations: {
      workouts: { type: String },
      dietPlan: { type: String },
      mindfulness: { type: String },
    },
  },
  { timestamps: true }
);

module.exports =mongoose.models.HealthProfile|| mongoose.model("HealthProfile", HealthProfileSchema);