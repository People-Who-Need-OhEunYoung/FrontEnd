import { userSearch } from './index';
const Mypage = () => {
  return (
    <>
      <button
        onClick={() => {
          userSearch('ejrrl6931');
        }}
      >
        API 테스트
      </button>
    </>
  );
};
export default Mypage;
