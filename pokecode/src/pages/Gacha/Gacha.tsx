import { motion } from 'framer-motion';
import { MainWrapper } from '../../components/MainWrapper';
import garchimg from '../../assets/images/gachaimg.gif';
import { DesignedButton1 } from '../../components/DesignedButton';
import { Link } from 'react-router-dom';
const Gacha = () => {
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
      <MainWrapper style={{ background: '#FFBBD3', flexDirection: 'column' }}>
        <h1 style={{ color: '#80495C', fontWeight: 'bold', fontSize: '3em' }}>
          새로운 포켓몬 뽑기
        </h1>
        <div
          style={{
            width: '40%',
            overflow: 'hidden',
            borderRadius: '50% 50% 50% 0',
          }}
        >
          <img src={garchimg} width={'100%'} />
        </div>
        <div>
          <DesignedButton1
            style={{ width: '400px', margin: '20px 0' }}
            color="#80495C"
          >
            뽑기 크래딧 (100)
          </DesignedButton1>
        </div>
        <div>
          <DesignedButton1
            style={{ width: '400px', margin: '20px 0' }}
            color="#80495C"
          >
            <Link to={'/usermain'}>나가기</Link>
          </DesignedButton1>
        </div>
      </MainWrapper>
    </motion.div>
  );
};

export default Gacha;
