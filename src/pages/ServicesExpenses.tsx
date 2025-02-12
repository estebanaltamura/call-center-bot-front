import { useLoadingContext } from 'contexts/LoadingProvider';
import Loader from 'components/general/Loader';
import ServicesExpensesView from 'views/servicesExpenses/ServicesExpensesView';

const ServicesExpensesPage = () => {
  // Contexts
  const { isLoading } = useLoadingContext();

  return (
    <div className="flex flex-col h-full">
      {/* Contenido */}
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex-1 overflow-auto p-4">
          <ServicesExpensesView />
        </div>
      )}
    </div>
  );
};

export default ServicesExpensesPage;
