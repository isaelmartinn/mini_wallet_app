import React from 'react';
import { render } from '@testing-library/react-native';
import { NoContactsState } from './NoContactsState';

describe('NoContactsState', () => {
  it('renders correctly', () => {
    const { getByText } = render(<NoContactsState />);

    expect(getByText('No hay contactos disponibles')).toBeTruthy();
  });
});
