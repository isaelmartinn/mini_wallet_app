import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ContactItem } from './ContactItem';
import { Contact } from '@/types/contacts';

describe('ContactItem', () => {
  const mockContact: Contact = {
    id: '1',
    name: 'John Doe',
    phoneNumber: '+1234567890',
  };

  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders contact information correctly', () => {
    const { getByText } = render(
      <ContactItem contact={mockContact} onPress={mockOnPress} />,
    );

    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('+1234567890')).toBeTruthy();
    expect(getByText('J')).toBeTruthy();
  });

  it('displays first letter of name in avatar', () => {
    const { getByText } = render(
      <ContactItem contact={mockContact} onPress={mockOnPress} />,
    );

    expect(getByText('J')).toBeTruthy();
  });

  it('displays first letter uppercase in avatar', () => {
    const lowercaseContact: Contact = {
      id: '2',
      name: 'jane smith',
      phoneNumber: '+9876543210',
    };

    const { getByText } = render(
      <ContactItem contact={lowercaseContact} onPress={mockOnPress} />,
    );

    expect(getByText('J')).toBeTruthy();
  });

  it('calls onPress with contact when pressed', () => {
    const { getByText } = render(
      <ContactItem contact={mockContact} onPress={mockOnPress} />,
    );

    const contactItem = getByText('John Doe');
    fireEvent.press(contactItem);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
    expect(mockOnPress).toHaveBeenCalledWith(mockContact);
  });

  it('renders correctly with empty phone number', () => {
    const contactWithoutPhone: Contact = {
      id: '3',
      name: 'No Phone',
      phoneNumber: '',
    };

    const { getByText } = render(
      <ContactItem contact={contactWithoutPhone} onPress={mockOnPress} />,
    );

    expect(getByText('No Phone')).toBeTruthy();
    expect(getByText('')).toBeTruthy();
  });
});
