
import React from 'react';
import { Button } from "@/components/ui/button";

interface FormSubmitButtonProps {
  isLoading: boolean;
}

const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({ isLoading }) => (
  <div className="pt-4">
    <Button 
      type="submit" 
      className="w-full bg-cricket-500 hover:bg-cricket-600 font-medium py-3"
      disabled={isLoading}
    >
      {isLoading ? "Analyzing Match Data..." : "Predict Match Outcome"}
    </Button>
  </div>
);

export default FormSubmitButton;
