import { FaCircleArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../Backbutton/backbutton.css";

export default function Backbtn() {
  const navigate = useNavigate();

  return (
    <motion.i
      onClick={() => navigate(-1)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="backbutton" // Use the CSS class
    >
      <FaCircleArrowLeft className="icon" />
      {/* <span>Back</span> */}
    </motion.i>
  );
}
