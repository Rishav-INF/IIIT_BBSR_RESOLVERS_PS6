import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "No description provided",
    },


    language: {
      type: String,
      required: true,
      enum: ["python", "javascript", "cpp", "java"],
    },

    deadline: {
      type: Date,
      required: true,
    },

    // ✅ Instructor who created the assignment
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ✅ Uploaded Files
    questionPdfUrl: {
      type: String,   // example: /uploads/pdf/172839123__question.pdf
      required: true,
    },
    inputFileUrl: {
      type: String,   // example: /uploads/cases/172839123__input.txt
      required: true,
    },
    outputFileUrl: {
      type: String,   // example: /uploads/cases/172839123__output.txt
      required: true,
    },

    // ✅ After reading input + output files → generate test cases
    totalCases: {
      type: Number,
      default: 0,
    },

    // ✅ Students who already completed this assignment (one student → one attempt)
    completedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Assignment", assignmentSchema);