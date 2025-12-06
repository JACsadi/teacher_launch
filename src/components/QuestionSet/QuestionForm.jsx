import React from "react";
import { X } from "lucide-react";

// Component for creating a single MCQ question
function QuestionForm({ questionData, index, updateQuestion, removeQuestion }) {
  // Handler for text input changes (Question text and Options)
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    if (name === "question") {
      updateQuestion(index, { ...questionData, question: value });
    } else {
      updateQuestion(index, {
        ...questionData,
        options: { ...questionData.options, [name]: value },
      });
    }
  };

  // Handler for correct answer selection
  const handleCorrectAnswerChange = (e) => {
    updateQuestion(index, { ...questionData, correctAnswer: e.target.value });
  };

  const optionsKeys = Object.keys(questionData.options);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 mb-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-red-600">
          Question #{index + 1}
        </h3>
        <button
          onClick={() => removeQuestion(index)}
          className="p-2 text-red-500 hover:text-red-700 transition duration-150 bg-red-50 hover:bg-red-100 rounded-full"
          aria-label={`Remove Question ${index + 1}`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Question Text Area */}
      <div className="mb-4">
        <label
          htmlFor={`question-${index}`}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Question Text
        </label>
        <textarea
          id={`question-${index}`}
          name="question"
          rows="2"
          value={questionData.question}
          onChange={handleTextChange}
          placeholder="Type the question here..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-150"
        ></textarea>
      </div>

      {/* MCQ Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {optionsKeys.map((key) => (
          <div key={key}>
            <label
              htmlFor={`option-${index}-${key}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Option {key}
            </label>
            <input
              type="text"
              id={`option-${index}-${key}`}
              name={key}
              value={questionData.options[key]}
              onChange={handleTextChange}
              placeholder={`Enter option ${key} text`}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-150"
            />
          </div>
        ))}
      </div>

      {/* Correct Answer Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Correct Answer:
        </label>
        <div className="flex space-x-4">
          {optionsKeys.map((key) => (
            <label
              key={`correct-${index}-${key}`}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="radio"
                name={`correct-answer-${index}`}
                value={key}
                checked={questionData.correctAnswer === key}
                onChange={handleCorrectAnswerChange}
                className="form-radio h-5 w-5 text-red-600 focus:ring-red-500 transition duration-150"
              />
              <span className="text-gray-900 font-medium">Option {key}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuestionForm;