import React from "react";

const Loading = ({
  size = "medium",
  color = "#007bff",
  message = "Loading...",
  className = ""
}) => {
  const spinnerSizeClass = {
    small: "loading-spinner-small",
    medium: "loading-spinner-medium",
    large: "loading-spinner-large"
  }[size];

  return (
    <>
      <style>
        {`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 2rem;
            animation: fadeIn 0.4s ease-out;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            min-height: 150px;
          }

          .loading-spinner-small {
            width: 1.5rem;
            height: 1.5rem;
            border-width: 0.2rem;
          }

          .loading-spinner-medium {
            width: 2.5rem;
            height: 2.5rem;
            border-width: 0.3rem;
          }

          .loading-spinner-large {
            width: 4rem;
            height: 4rem;
            border-width: 0.4rem;
          }

          .loading-spinner {
            border-color: ${color} transparent ${color} transparent !important;
            border-style: solid;
            border-radius: 50%;
            animation: spin 1s ease-in-out infinite;
            position: relative;
          }

          .loading-spinner::after {
            content: '';
            position: absolute;
            top: -5px;
            left: -5px;
            right: -5px;
            bottom: -5px;
            border-radius: 50%;
            background: radial-gradient(circle, ${color}10, transparent);
            z-index: -1;
          }

          .loading-message {
            font-size: 1rem;
            color: ${color};
            margin-top: 0.75rem;
            font-weight: 500;
            letter-spacing: 0.5px;
            animation: textFade 1.8s ease-in-out infinite;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          @keyframes textFade {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
        `}
      </style>
      <div className={`loading-container ${className}`}>
        <div
          className={`spinner-border loading-spinner ${spinnerSizeClass}`}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        {message && <div className="loading-message">{message}</div>}
      </div>
    </>
  );
};

export default Loading;
