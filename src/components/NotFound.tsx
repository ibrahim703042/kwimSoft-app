import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center min-h-[75vh] text-center px-4"
    >
      <div className="bg-destructive/10 dark:bg-destructive/20 p-4 rounded-full">
        <AlertTriangle className="w-12 h-12 text-destructive" />
      </div>

      <h1 className="text-5xl font-extrabold tracking-tight mt-6 text-foreground">404</h1>
      <p className="text-lg text-muted-foreground mt-2">Page not found</p>
      <p className="text-sm text-muted-foreground max-w-md mt-1">
        The page you're looking for doesn't exist or has been moved. Try heading back to the homepage.
      </p>

      <Button
        onClick={() => navigate("/")}
        className="mt-6"
        size="lg"
      >
        Return to Dashboard
      </Button>
    </motion.div>
  );
};

export default NotFound;
