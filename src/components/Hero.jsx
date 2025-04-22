import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="hero-container" style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#0b0c10",
      color: "#fff",
      textAlign: "center"
    }}>
      <motion.h1
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ fontSize: "3rem", fontWeight: "bold" }}
      >
        Welcome to <span style={{ color: "#00d8ff" }}>Darkstar.Network</span>
      </motion.h1>
    </div>
  );
}
