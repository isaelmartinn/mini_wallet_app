import React from 'react';
import {render} from '@testing-library/react-native';
import {SplashScreen} from './SplashScreen';

describe('SplashScreen', () => {
  it('debe renderizar correctamente', () => {
    const {getByText} = render(<SplashScreen />);

    expect(getByText('Mini Wallet')).toBeTruthy();
  });

  it('debe mostrar el título con el texto correcto', () => {
    const {getByText} = render(<SplashScreen />);

    const title = getByText('Mini Wallet');
    expect(title).toBeTruthy();
  });

  it('debe renderizar el ActivityIndicator', () => {
    const {UNSAFE_getByType} = render(<SplashScreen />);
    const {ActivityIndicator} = require('react-native');

    const loader = UNSAFE_getByType(ActivityIndicator);
    expect(loader).toBeTruthy();
    expect(loader.props.size).toBe('large');
  });

  it('debe tener la estructura correcta de componentes', () => {
    const {UNSAFE_getAllByType} = render(<SplashScreen />);
    const {View, Text} = require('react-native');

    const views = UNSAFE_getAllByType(View);
    const texts = UNSAFE_getAllByType(Text);

    expect(views.length).toBeGreaterThan(0);
    expect(texts.length).toBe(1);
  });
});
