import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export const twoOptionsPopUp = async (
  title: string,
  callback: () => Promise<any>,
  messageAfterCallback: string,
) => {
  const MySwal = withReactContent(Swal);

  const response = await MySwal.fire({
    title: title,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    customClass: {
      title: 'custom-swal-title',
    },
  });

  if (response.isConfirmed) {
    await callback();
    await MySwal.fire(messageAfterCallback);
  }
};
