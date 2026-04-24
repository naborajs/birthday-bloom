import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface MatrixChar {
  id: number;
  x: number;
  y: number;
  char: string;
  speed: number;
}

export const DigitalRain = ({ 
  opacity = 0.1, 
  color = "rgba(255, 107, 107, 0.3)" 
}) => {
  const [chars, setChars] = useState<MatrixChar[]>([]);

  useEffect(() => {
    const characters =
      "ﾊﾐﾋｰｳﾆﾑﾑﾀﾓﾗﾘﾏﾋﾊﾐﾐﾊﾁﾎﾜﾔﾔﾐﾕﾘﾞﾎﾞﾀﾄﾎﾎﾏﾂﾘﾡﾓﾪﾈﾇﾊﾐﾊﾑﾀﾃﾅﾊﾔﾏﾇﾦﾂﾀﾆﾇﾎﾆﾆﾆﾉﾍﾀﾞﾘﾔﾀﾆﾂﾀﾎﾓﾁﾆﾆﾆﾏﾂﾊﾄﾊﾄﾈﾈﾎﾓ";
    const cols = Math.floor(window.innerWidth / 30);
    const newChars: MatrixChar[] = [];

    for (let i = 0; i < cols; i++) {
      newChars.push({
        id: i,
        x: i * 30,
        y: Math.random() * window.innerHeight,
        char: characters[Math.floor(Math.random() * characters.length)],
        speed: 2 + Math.random() * 4,
      });
    }

    setChars(newChars);
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none font-mono text-sm overflow-hidden"
      style={{ opacity }}
    >
      {chars.map((item) => (
        <motion.div
          key={item.id}
          className="absolute"
          style={{
            left: item.x,
            color: color,
            textShadow: `0 0 8px ${color}`,
            fontWeight: "bold",
          }}
          animate={{
            y: [item.y, window.innerHeight + 100],
          }}
          transition={{
            duration: item.speed,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {item.char}
        </motion.div>
      ))}
    </div>
  );
};
