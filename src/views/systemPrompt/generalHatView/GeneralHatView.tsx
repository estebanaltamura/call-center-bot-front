import EditViewContainer from 'components/hats/editView/EditViewContainer';
import MainViewContainer from 'components/hats/mainView/MainViewContainer';
import { useHatContext } from 'contexts/HatProvider';

import { useEffect, useState } from 'react';
import { IHatEntity } from 'types/dynamicSevicesTypes';

const GeneralHatView = () => {
  const { mode, setMode, itemToEdit, setItemToEdit, allItemList } = useHatContext();

  if (mode === 'main') {
    return (
      <MainViewContainer mode={mode} setMode={setMode} setEditItem={setItemToEdit} hatList={allItemList} />
    );
  }

  if (mode === 'edit' && itemToEdit) {
    return <EditViewContainer editItem={itemToEdit} setEditItem={setItemToEdit} setMode={setMode} />;
  } else return <div>Modo no definido</div>;
};

export default GeneralHatView;
