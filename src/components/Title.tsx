import React from "react";
import {motion} from "framer-motion"

const Title = () => {
  return (
    <div className="w-screen flex justify-center">
      <motion.div className="text-white font-vt323 text-8xl relative"
              animate={{
                y: [-10, 10, -10], // Moves the div up and down
              }}
              transition={{
                duration: 2, // Animation duration
                repeat: Infinity, // Repeat infinitely
                ease: "easeInOut", // Smooth transition
              }}>
        <div className="absolute top-[100px] md:top-[200px] transform -translate-x-1/2 -translate-y-1/2">
          <p>
          NONOGRAM
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Title;