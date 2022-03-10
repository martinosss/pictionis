import React from 'react'
import { StyleSheet } from 'react-native'
import * as Yup from 'yup'

import Colors from '../utils/colors'
import SafeView from '../components/SafeView'
import Form from '../components/Forms/Form'
import FormField from '../components/Forms/FormField'
import FormButton from '../components/Forms/FormButton'
import IconButton from '../components/IconButton'
import useStatusBar from '../hooks/useStatusBar'

const validationSchema = (password) =>
  Yup.object().shape({
    password: Yup.string().required().matches(new RegExp(password), 'Invalid password')
  })

export default function GameAuth({ navigation, route }) {
  const { game } = route.params
  useStatusBar('dark-content')

  async function onSubmit() {
    navigation.navigate('Game', {
      game: { ...game, uid: game.uid },
    })
  }

  return (
    <SafeView style={styles.container}>
      <Form
        initialValues={{ name: '', word: '' }}
        validationSchema={validationSchema(game.password)}
        onSubmit={(values) => onSubmit(values)}
      >
        <FormField
          name="password"
          leftIcon="lock"
          autoCapitalize="none"
          placeholder="Enter game password"
          textContentType="password"
        />
        <FormButton title="Join game" />
      </Form>
      <IconButton
        style={styles.backButton}
        iconName="keyboard-backspace"
        color="#fff"
        size={30}
        onPress={() => navigation.goBack()}
      />
    </SafeView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: Colors.mediumGrey,
  },
  footerButtonContainer: {
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
