import { useEffect, useRef, useState } from 'react';
import { geohashForLocation } from 'geofire-common';
import PropTypes from 'prop-types';

const InputLocation = ({
  label,
  placeholder,
  onPlaceSelected,
  value,
  variant = 'outlined',
  isDisabled,
  helperText = 'Podes ingresar mas de una',
  keepValue = true, // Cambiado a true para que el valor quede en el input
}) => {
  const [query, setQuery] = useState(value);
  const autoCompleteRef = useRef(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  let autoComplete;

  async function handlePlaceSelect(updateQuery) {
    const addressObject = autoComplete.getPlace();
    const queryStr = addressObject.formatted_address || '';
    updateQuery(queryStr);

    if (!addressObject.geometry || !addressObject.geometry.location) {
      return;
    }

    let city =
      addressObject.address_components?.find((ad) => ad.types?.includes('locality')) ||
      addressObject.address_components?.find((ad) => ad.types?.includes('sublocality'));

    const county = addressObject.address_components?.find((ad) =>
      ad.types?.includes('administrative_area_level_2'),
    );

    const postal_code = addressObject.address_components?.find((ad) => ad.types?.includes('postal_code'));

    const state = addressObject.address_components?.find((ad) =>
      ad.types?.includes('administrative_area_level_1'),
    );

    const street =
      addressObject.address_components?.find((ad) => ad.types?.includes('route'))?.long_name || '';

    const streetNumber =
      addressObject.address_components?.find((ad) => ad.types?.includes('street_number'))?.long_name || '';

    const country =
      addressObject.address_components?.find((ad) => ad.types?.includes('country'))?.long_name || '';

    onPlaceSelected({
      lat: addressObject.geometry.location.lat(),
      lng: addressObject.geometry.location.lng(),
      city: city ? city.long_name : null,
      county: county ? county.long_name : null,
      postal_code: postal_code ? postal_code.long_name : null,
      state: state ? state.long_name : null,
      address: queryStr, // Captura la dirección completa para que se mantenga en el input
      streetAndNumber: streetNumber ? `${street} ${streetNumber}` : street,
      country: country,
      geohash: geohashForLocation([
        addressObject.geometry.location.lat(),
        addressObject.geometry.location.lng(),
      ]),
    });

    if (keepValue) setQuery(queryStr); // Actualizar el estado query para que el valor quede en el input
  }

  function handleScriptLoad(updateQuery, autoCompleteRefAux) {
    if (window.google && window.google.maps) {
      autoComplete = new window.google.maps.places.Autocomplete(autoCompleteRefAux.current, {
        types: ['address'], // Cambiado a 'address' para permitir direcciones completas
        componentRestrictions: { country: 'ar' },
      });

      autoComplete.setFields(['address_components', 'formatted_address', 'geometry']);
      autoComplete.addListener('place_changed', () => handlePlaceSelect(updateQuery));
    } else {
      console.error('Google Maps script not loaded properly.');
    }
  }

  function loadGoogleMapsScript(callback) {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google && window.google.maps) {
          setIsGoogleMapsLoaded(true);
          callback();
        } else {
          console.error('Google Maps script failed to load.');
        }
      };
      script.onerror = () => console.error('Error loading Google Maps script.');
      document.head.appendChild(script);
    } else {
      setIsGoogleMapsLoaded(true);
      callback();
    }
  }

  useEffect(() => {
    if (!isGoogleMapsLoaded) {
      loadGoogleMapsScript(() => {
        if (autoCompleteRef.current && window.google) {
          handleScriptLoad(setQuery, autoCompleteRef);
        }
      });
    } else if (autoCompleteRef.current && window.google) {
      handleScriptLoad(setQuery, autoCompleteRef);
    }
  }, [isGoogleMapsLoaded]);

  useEffect(() => {
    setQuery(value); // Mantener actualizado el input con el valor desde props
  }, [value]);

  return (
    <div className="relative">
      <input
        type="text"
        ref={autoCompleteRef}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        disabled={isDisabled}
        placeholder={placeholder}
        className="w-full px-3 py-2 border h-11 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
        <img src="/images/icons/locationProfileJourneyIcon.svg" alt="" width="22px" />
      </div>
    </div>
  );
};

InputLocation.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onPlaceSelected: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  variant: PropTypes.string,
  isDisabled: PropTypes.bool,
  helperText: PropTypes.string,
  keepValue: PropTypes.bool,
};

export default InputLocation;
