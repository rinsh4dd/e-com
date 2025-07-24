import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { Button } from "@material-tailwind/react";
import { toast } from "react-hot-toast";

function ErrorResponse({
  title = "Page Not Found",
  message = "Oops! It seems there's no page at this route. Kindly check the URL or try navigating again.",
  onRetry,
  retryText = "Retry",
  showToast = true,
  fullScreen = true,
  animation = true,
  severity = "error", // only "error" supported in this version
}) {
  const redTheme = {
    bg: "bg-white",
    iconColor: "text-red-600",
    text: "text-red-800",
    btn: "bg-red-600 hover:bg-red-700",
    icon: "mdi:alert-circle-outline",
  };

  useEffect(() => {
    if (showToast) {
      toast.error("Navigation Error: No matching route found.", {
        icon: <Icon icon={redTheme.icon} className={`text-lg ${redTheme.iconColor}`} />,
        duration: 5000,
        position: "top-center",
        style: {
          background: "#fff5f5",
          color: "#b91c1c",
          borderLeft: "4px solid #ef4444",
        },
      });
    }
  }, [showToast]);

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      initial={animation ? "hidden" : false}
      animate={animation ? "visible" : ""}
      variants={animation ? variants : {}}
      className={`${redTheme.bg} ${fullScreen ? "h-[100vh]" : ""} w-full flex flex-col justify-center items-center px-6`}
    >
      {/* Icon */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="mb-6"
      >
        <Icon icon={redTheme.icon} className={`w-20 h-20 ${redTheme.iconColor}`} />
      </motion.div>

      {/* Title */}
      <h1 className={`text-3xl md:text-4xl font-bold mb-4 text-center ${redTheme.text}`}>
        {title}
      </h1>

      {/* Message */}
      <p className={`text-lg text-center max-w-xl mb-8 ${redTheme.text}`}>
        {message}
      </p>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <Button
          onClick={handleRetry}
          className={`${redTheme.btn} text-white py-3 px-6 rounded-md shadow-md`}
        >
          <Icon icon="material-symbols:refresh" className="text-lg mr-2" />
          {retryText}
        </Button>
        
      </div>

      {/* Optional Technical Debug Info (only in dev) */}
      {process.env.NODE_ENV === "development" && (
        <details className="mt-6 text-sm text-gray-600">
          <summary>Developer Info</summary>
          <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto max-w-lg">
{JSON.stringify({
  message,
  timestamp: new Date().toISOString(),
}, null, 2)}
          </pre>
        </details>
      )}
    </motion.div>
  );
}

ErrorResponse.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  onRetry: PropTypes.func,
  retryText: PropTypes.string,
  showToast: PropTypes.bool,
  fullScreen: PropTypes.bool,
  animation: PropTypes.bool,
  severity: PropTypes.string,
};

export default ErrorResponse;
