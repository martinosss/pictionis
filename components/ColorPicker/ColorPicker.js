import React from 'react'
import AppButton from '../AppButton'
import { View } from 'react-native'
import { TriangleColorPicker } from 'react-native-color-picker'

export default function ColorPickerComponent ({ onClose, color, onColorChange }) {
  return (
    <View
      style={{
        flex: 1,
        padding: 10,
        height: 100,
        backgroundColor: '#212021',
      }}
    >
      <AppButton
        title="Close"
        style={{ width: 100 }}
        onPress={onClose}
      />
      <TriangleColorPicker
        color={color}
        oldColor="red"
        onColorChange={onColorChange}
        style={{ flex: 1 }}
      />
    </View>
  )
}