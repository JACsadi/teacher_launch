import React, { useState } from "react";
import { Upload, FileText, Download, X, AlertCircle, CheckCircle, Loader } from "lucide-react";

const PDFUpload = ({ onQuestionsGenerated, metadata, onMetadataChange }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Please upload a PDF file only");
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError("File size should be less than 10MB");
        return;
      }
      setPdfFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!pdfFile) {
      setError("Please select a PDF file first");
      return;
    }

    if (!metadata.class || !metadata.subjectName || !metadata.lessonName) {
      setError("Please fill in all metadata fields (Class, Subject, Lesson)");
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("pdf", pdfFile);

    try {
      const response = await fetch("https://quiz-app-ai.onrender.com/api/upload-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Process the questions to match the expected format
      const processedQuestions = data.questions.map((q, index) => {
        // Ensure the answer is one of the options provided
        let correctAnswer = q.answer || "A";

        // Check if the answer matches one of the options
        const options = {
          A: q.options[0] || "",
          B: q.options[1] || "",
          C: q.options[2] || "",
          D: q.options[3] || ""
        };

        // If the answer is not one of the option texts, default to 'A'
        if (q.answer && !Object.values(options).includes(q.answer)) {
          // If answer is a letter like 'A', 'B', 'C', or 'D', use it directly
          if (['A', 'B', 'C', 'D'].includes(q.answer)) {
            correctAnswer = q.answer;
          } else {
            // If it's not a valid option text or letter, default to 'A'
            correctAnswer = "A";
          }
        } else if (q.answer) {
          // Find which option letter matches the answer text
          for (const [key, value] of Object.entries(options)) {
            if (value === q.answer) {
              correctAnswer = key;
              break;
            }
          }
        }

        return {
          question: q.question,
          options: options,
          correctAnswer: correctAnswer
        };
      });

      setSuccess(`${processedQuestions.length} questions generated successfully!`);
      onQuestionsGenerated(processedQuestions);
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error("Upload error:", err);
      setError(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setPdfFile(null);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-red-600 flex items-center">
        <FileText className="w-5 h-5 mr-2" />
        Generate Questions from PDF
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <input
          type="text"
          name="class"
          value={metadata.class}
          onChange={onMetadataChange}
          placeholder="Class (e.g., 9, 10, XII)"
          className="p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
          required
        />
        <input
          type="text"
          name="subjectName"
          value={metadata.subjectName}
          onChange={onMetadataChange}
          placeholder="Subject Name (e.g., Physics)"
          className="p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
          required
        />
        <input
          type="text"
          name="lessonName"
          value={metadata.lessonName}
          onChange={onMetadataChange}
          placeholder="Lesson Name (e.g., Electromagnetism)"
          className="p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
          required
        />
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
        {!pdfFile ? (
          <div>
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Drag & drop your PDF file here, or click to browse</p>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="pdf-upload"
            />
            <label
              htmlFor="pdf-upload"
              className="inline-flex items-center px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-200 cursor-pointer"
            >
              <Upload className="w-5 h-5 mr-2" />
              Choose PDF File
            </label>
            <p className="text-sm text-gray-500 mt-2">Max file size: 10MB, PDF only</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-between w-full max-w-md mb-4">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-red-500 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-800 truncate">{pdfFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition duration-200"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="inline-flex items-center px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-200 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader className="animate-spin w-5 h-5 mr-2" />
                  Generating Questions...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Generate Questions
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Success/ Error messages */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-green-800">Success</h3>
            <p className="text-sm text-green-700">{success}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFUpload;