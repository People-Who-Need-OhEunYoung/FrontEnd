import styled from 'styled-components';
import { motion } from 'framer-motion';

const Problem = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{
        duration: 1,
      }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'relative', height: 'calc(100vh - 180px)' }}
    >
      <div style={{ background: 'red', width: '100%' }}></div>
    </motion.div>
  );
};
export default Problem;
