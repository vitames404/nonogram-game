import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HowToPlayPopupProps {
  onClose: () => void;
  isVisible: boolean; // Add this prop to control visibility
}

const HowToPlayPopup: React.FC<HowToPlayPopupProps> = ({ onClose, isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0 }} // Start with 0 opacity
          animate={{ opacity: 1 }} // Animate to full opacity
          exit={{ opacity: 0 }} // Animate back to 0 opacity when exiting
          transition={{ duration: 0.3 }} // Animation duration
        >
          <motion.div
            className="bg-gray-800 p-8 rounded-lg max-w-2xl w-full mx-4 text-white"
            initial={{ y: -20, opacity: 0 }} // Start slightly above and invisible
            animate={{ y: 0, opacity: 1 }} // Animate to center and visible
            exit={{ y: -20, opacity: 0 }} // Animate back up and fade out
            transition={{ duration: 0.3 }} // Animation duration
          >
            <h2 className="text-3xl font-bold mb-4">How to Play Nonogram</h2>
            <p className="text-1xl mb-4">
              The purpose of this game is to discover a board made up of blue squares and free spaces. You can do this by looking at row/column definitions: a sequence of numbers that describe groups of consecutive squares appearing on that row/column. For example, <strong>1 5 2</strong> means one square, 5 squares, and 2 squares, in this order, separated by one or more spaces between them.
            </p>
            <p className="text-1xl mb-4">
              You can click the squares once to mark them as occupied. Clicking them again will mark them with a red square (invalid, to show that there's nothing there). You can use this sign to track the squares that you consider to be empty. Clicking them again brings the squares back to their original state.
            </p>
            <img src="/nonogram_example.png" alt="Example" />
            <button
              onClick={onClose}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-4"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HowToPlayPopup;