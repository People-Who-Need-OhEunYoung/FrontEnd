import { useLocation } from 'react-router-dom';
import { ResizableTabs } from '../../components/ResizableTabs';
const Problem = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id') || '';

  return <ResizableTabs id={id} />;
};

export default Problem;
