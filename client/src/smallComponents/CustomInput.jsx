import React ,{useState} from 'react';
import { TextField } from '@mui/material';

const CustomInput = ({
  onChange,
  onFocus,
  onBlur,
  value,
  label,
  imgSrc,
  isFocused,
  name,
  type,
}) => {
  return (
    <div className={`inputContainer ${isFocused || value ? 'focused' : ''}`}>
      <img className='emailIcon' src={imgSrc} alt={`${label} Icon`} />
      <TextField
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        value={value}
        className='textField'
        id="outlined-basic"
        label={label}
        variant="outlined"
        name={name}
        type={type}
        sx={{
          width: '100%', // Custom width
          '& .MuiOutlinedInput-root': {
            height: '5vhpx', // Custom height for the input field
            padding: '0 14px', // Ensure proper padding
            '& fieldset': {
              border: 'none', // Remove border
            },
            '&:hover fieldset': {
              border: 'none', // Remove border on hover
            },
            '&.Mui-focused fieldset': {
              border: 'none', // Remove border when focused
            },
            '& input': {
              padding: '10px 0', // Adjust input padding to fit smaller height
            },
          },
          '& .MuiInputLabel-root': {
            transform: 'translate(0px, 10px) scale(1)', // Position the label
            '&.Mui-focused, &.MuiFormLabel-filled': {
              transform: 'translate(5px, -9px) scale(0.75)', // Move label when focused
            },
          },
        }}
      />
    </div>
  );
};

export default CustomInput;
