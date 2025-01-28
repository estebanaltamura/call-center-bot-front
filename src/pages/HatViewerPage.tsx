// import HatViewer from 'components/hats/hatViewer/HatViewer';
import HatViewer from 'components/hats/hatViewer/HatViewer';
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const HatViewerPage = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id'); // Captura el valor de `id`
  const navigate = useNavigate();

  if (!id) {
    navigate('/hats');
    return null;
  }

  return <HatViewer hatId={id} />;
};

export default HatViewerPage;
{
  /* <HatViewer hatId={id} /> */
}
