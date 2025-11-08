import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema(
  {
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },
    inputText: { type: String, required: true },         // contents of inputN.txt
    expectedText: { type: String, required: true },      // contents of outputN.txt
    points: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("TestCase", testCaseSchema);