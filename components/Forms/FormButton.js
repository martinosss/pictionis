import React from 'react';
import { useFormikContext } from 'formik';

import AppButton from '../AppButton';

export default function FormButton({ title, style }) {
  const { handleSubmit } = useFormikContext();

  return <AppButton title={title} style={style} onPress={handleSubmit} />;
}
