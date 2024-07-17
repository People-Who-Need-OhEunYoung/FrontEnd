import { useLocation } from 'react-router-dom';
import { ResizableTabsReview } from '../../components/ResizableTabsReview';
const Room = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id') || '';
  const title = searchParams.get('title') || '';

  return <ResizableTabsReview id={id} title={title} editorRoom={''} />;
};

export default Room;
