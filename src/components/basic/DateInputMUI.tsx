import React, { useEffect, useState, type ChangeEvent } from 'react';
import { TextField } from '@mui/material';

interface DateInputMuiProps {
  label: string;
  value: string;
  onChange: (value: string | null) => void;
  variant?: 'outlined' | 'filled' | 'standard';
  fullWidth?: boolean;
  size?: 'small' | 'medium';
}

const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

const isValidDate = (dateString: string): boolean => {
  if (!dateRegex.test(dateString)) return false;
  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

const DateInputMui: React.FC<DateInputMuiProps> = ({
  label,
  value,
  onChange,
  variant = 'outlined',
  fullWidth = true,
  size = 'medium',
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [error, setError] = useState('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
    if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5);

    setInputValue(value);

    if (value.length === 10) {
      if (isValidDate(value)) {
        setError('');
        onChange(`${value.substring(6,10)}-${value.substring(3,5)}-${value.substring(0,2)}`);
      } else {
        setError('Data inválida.');
        onChange(null);
      }
    } else {
      setError('');
      onChange(null);
    }
  };

  // para que handleInputChange seja executado na montagem quando inputValue já tem valor
  useEffect(() => {
    if (inputValue) {
      handleInputChange({ target: { value: inputValue }} as any);
    }
  }, []);

  return (
    <TextField
      label={label}
      placeholder="dd/mm/aaaa"
      value={inputValue}
      onChange={handleInputChange}
      error={!!error}
      helperText={error}
      variant={variant}
      fullWidth={fullWidth}
      size={size}
      // inputProps={{ maxLength: 10 }}
      slotProps={{ htmlInput:{ maxLength: 10 }}}
    />
  );
};

export default DateInputMui;
