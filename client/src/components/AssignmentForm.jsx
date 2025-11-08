import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function AssignmentForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    language: "python",
    questionPdf: null,
    inputFile: null,
    outputFile: null,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input field change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file uploads
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      data.append("title", formData.title);
      data.append(
        "description",
        formData.description || "No description provided"
      );
      data.append("deadline", new Date(formData.deadline).toISOString());
      data.append("language", formData.language);

      if (!formData.questionPdf || !formData.inputFile || !formData.outputFile) {
        setMessage("❌ Please upload all 3 files (PDF, input.txt, output.txt)");
        setLoading(false);
        return;
      }

      data.append("questionPdf", formData.questionPdf);
      data.append("inputFile", formData.inputFile);
      data.append("outputFile", formData.outputFile);

      const res = await axios.post(
        "http://localhost:5000/api/assignments/create",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Assignment created successfully!");
      console.log("Server Response:", res.data);

      // Reset form
      setFormData({
        title: "",
        description: "",
        deadline: "",
        language: "python",
        questionPdf: null,
        inputFile: null,
        outputFile: null,
      });
    } catch (error) {
      console.error("Upload Error:", error);
      setMessage(
        "❌ Error creating assignment. Please check file format or authentication."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gray-900 text-white rounded-2xl shadow-lg border border-gray-800 p-6">
      <h2 className="text-xl font-semibold mb-4">🧾 Create New Assignment</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Assignment Title"
          className="input-field"
          required
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Assignment Description"
          className="input-field"
          required
        />

        <input
          type="datetime-local"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          className="input-field"
          required
        />

        <select
          name="language"
          value={formData.language}
          onChange={handleChange}
          className="input-field"
        >
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="javascript">JavaScript</option>
        </select>

        <label className="text-sm text-slate-300">Upload PDF Question:</label>
        <input
          type="file"
          name="questionPdf"
          accept=".pdf"
          onChange={handleFileChange}
          className="input-field"
          required
        />

        <label className="text-sm text-slate-300">Upload Input File (.txt):</label>
        <input
          type="file"
          name="inputFile"
          accept=".txt"
          onChange={handleFileChange}
          className="input-field"
          required
        />

        <label className="text-sm text-slate-300">Upload Output File (.txt):</label>
        <input
          type="file"
          name="outputFile"
          accept=".txt"
          onChange={handleFileChange}
          className="input-field"
          required
        />

        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          className="submit-btn"
        >
          {loading ? "Uploading…" : "Create Assignment"}
        </motion.button>
      </form>

      {message && <p className="text-center mt-4">{message}</p>}
    </div>
  );
}