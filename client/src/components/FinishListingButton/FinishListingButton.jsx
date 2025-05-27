// src/components/FinishListingButton/FinishListingButton.jsx

import { finishListingAction } from "../../api/listingActions";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function FinishListingButton({ listingId }) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFinishListing = async (e) => {
    e.stopPropagation();

    try {
      await finishListingAction(listingId);
    } catch (error) {
      console.error("Error updating listing:", error);
    } finally {
      setIsLoading(false);
      navigate(`/listing/${listingId}`);
    }
  };

  return (
    <>
      <button disabled={isLoading} onClick={handleFinishListing}>
        Oznacz listing jako zakończony
      </button>
    </>
  );
}

export default FinishListingButton;
