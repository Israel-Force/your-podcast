import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../Context/UserContext";

export default function Loadtask() {

  const { state } = useContext(UserContext);

  const backdrop = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  };
  const loadtask = {
    visible: {
      x: [-20, 20],
      transition: {
        x: {
          yoyo: Infinity,
          duration: 0.5,
        },
      },
    },
  };

  return (
    <AnimatePresence exitBeforeEnter>
      {state.loading ? (
        <motion.div
          className="backdrop"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="loadtask"
            variants={loadtask}
            animate="visible"
          ></motion.div>
        </motion.div>
      ) : (
        false
      )}
    </AnimatePresence>
  );
}
