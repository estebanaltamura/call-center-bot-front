import React from 'react';

type TypoProps = {
  type:
    | 'title1'
    | 'title1Semibold'
    | 'title2'
    | 'title2Semibold'
    | 'title3'
    | 'title3Semibold'
    | 'title4'
    | 'title4Semibold'
    | 'title5'
    | 'title5Semibold'
    | 'title6'
    | 'title6Semibold'
    | 'body1'
    | 'body1Semibold'
    | 'body2'
    | 'body2Semibold'
    | 'body3'
    | 'body3Semibold'
    | 'body4'
    | 'body4Semibold'
    | 'caption'
    | 'overline';

  children: React.ReactNode;
  align?: 'left' | 'center' | 'right'; // Nueva propiedad opcional para la alineación
};

const classMap: { [key in TypoProps['type']]: string } = {
  title1: 'text-title1 font-normal',
  title1Semibold: 'text-title1 font-semibold',
  title2: 'text-title2 font-normal',
  title2Semibold: 'text-title2 font-semibold',
  title3: 'text-title3 font-normal',
  title3Semibold: 'text-title3 font-semibold',
  title4: 'text-title4 font-normal',
  title4Semibold: 'text-title4 font-semibold',
  title5: 'text-title5 font-normal',
  title5Semibold: 'text-title5 font-semibold',
  title6: 'text-title6 font-normal',
  title6Semibold: 'text-title6 font-semibold',

  body1: 'text-body1 font-normal',
  body1Semibold: 'text-body1 font-semibold',
  body2: 'text-lg font-normal', // 18px para body2
  body2Semibold: 'text-lg font-semibold', // 18px para body2 semibold
  body3: 'text-body3 font-normal',
  body3Semibold: 'text-body3 font-semibold',
  body4: 'text-body4 font-normal',
  body4Semibold: 'text-body4 font-semibold',

  caption: 'text-caption font-normal',
  overline: 'text-overline font-normal',
};

const alignClassMap = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const Typo = ({ type, children, align }: TypoProps) => {
  const Tag = (() => {
    switch (type) {
      case 'title1':
      case 'title1Semibold':
        return 'h1';
      case 'title2':
      case 'title2Semibold':
        return 'h2';
      case 'title3':
      case 'title3Semibold':
        return 'h3';
      case 'title4':
      case 'title4Semibold':
        return 'h4';
      case 'title5':
      case 'title5Semibold':
        return 'h5';
      case 'title6':
      case 'title6Semibold':
        return 'h6';
      case 'body1':
      case 'body1Semibold':
      case 'body2':
      case 'body2Semibold':
      case 'body3':
      case 'body3Semibold':
      case 'body4':
      case 'body4Semibold':
      case 'caption':
      case 'overline':
        return 'p';
      default:
        return 'p'; // Fallback en caso de tipo no válido
    }
  })();

  // Combinar las clases predeterminadas con las de alineación
  const alignClass = align ? alignClassMap[align] : '';
  const combinedClassName = `${classMap[type]} ${alignClass}`.trim();

  return <Tag className={combinedClassName}>{children}</Tag>;
};

export default Typo;
