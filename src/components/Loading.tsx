import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {motion} from "framer-motion"

const Loading = () => {
  return (
        <><div className="fixed inset-0 z-0 pointer-events-none bg-gray-900">
        <Canvas>
            <Stars
                radius={100}
                depth={50}
                count={5000}
                factor={4}
                saturation={0}
                fade
                speed={1} />
        </Canvas>
      </div><div className="w-screen flex justify-center">
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
                          LOADING...
                      </p>
                  </div>
              </motion.div>
          </div></>
  );
};

export default Loading;