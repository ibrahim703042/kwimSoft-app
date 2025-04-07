import React from "react";

const Steps = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center w-full">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          {/* Cercle pour chaque étape */}
          <div
            className={`w-6 h-6 flex items-center justify-center rounded-full ${index <= currentStep
                ? "bg-[#191C21] text-white"
                : "bg-gray-300 text-gray-700"
              }`}
          >
            <p className="text-[0.7rem]">{index + 1}</p>
          </div>
          {/* Barre reliant les étapes */}
          {index < steps.length - 1 && (
            <div
              className={`h-[1px] w-44 ${index < currentStep ? "bg-[#191C21]" : "bg-gray-300"
                }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Steps;
