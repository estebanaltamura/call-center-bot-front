// ** Third Party libraries
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export const simplePopUp = async (title: string) => {
  const MySwal = withReactContent(Swal);

  await MySwal.fire({
    title: title,
    icon: 'warning',
    confirmButtonText: 'OK',
    customClass: {
      title: 'custom-swal-title', // Clase personalizada para el título
    },
  });
};
