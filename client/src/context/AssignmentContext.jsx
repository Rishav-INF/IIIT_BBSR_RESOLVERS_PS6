import React, { createContext, useContext, useState } from "react";

const AssignmentContext = createContext(null);

export const useAssignment = () => useContext(AssignmentContext);

export default function AssignmentProvider({ children }) {
  const [currentAssignment, setCurrentAssignment] = useState(null);
  /*
    Shape:
    {
      _id, title, language, deadline,
      questionPdfUrl, inputFileUrl, outputFileUrl,
      inputContent,  // text from input.txt
      outputContent, // text from output.txt
    }
  */
  return (
    <AssignmentContext.Provider value={{ currentAssignment, setCurrentAssignment }}>
      {children}
    </AssignmentContext.Provider>
  );
}