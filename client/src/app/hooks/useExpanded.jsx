import { useState, useEffect, useRef } from "react";

const useExpanded = (initialIsVisible) => {
  const [isExpanded, setIsExpanded] = useState(initialIsVisible);
  const ref = useRef(null);

  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return { ref, isExpanded, setIsExpanded };
};

export default useExpanded;
