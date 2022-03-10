import React, { useContext, useState } from 'react'
import { StyleSheet } from 'react-native'
import * as Yup from 'yup'

import Colors from '../utils/colors'
import SafeView from '../components/SafeView'
import Form from '../components/Forms/Form'
import FormField from '../components/Forms/FormField'
import FormButton from '../components/Forms/FormButton'
import IconButton from '../components/IconButton'
import useStatusBar from '../hooks/useStatusBar'
import { database } from '../components/Firebase/firebase'
import { AuthUserContext } from '../navigation/AuthUserProvider'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Please enter a game name').label('name'),
  word: Yup.string().required('Please enter a word to guess'),
  password: Yup.string(),
})

export default function CreateGameScreen({ navigation }) {
  const { user } = useContext(AuthUserContext)
  useStatusBar('dark-content')

  async function onSubmit(values) {
    const ref = await database.ref('games').push({
      createdBy: user.uid,
      createdAt: new Date().toISOString(),
      ...values,
    })

    const game = await database.ref(ref).once('value')

    navigation.navigate('Game', {
      game: { ...game.val(), uid: game.key },
    })
  }

  return (
    <SafeView style={styles.container}>
      <Form
        initialValues={{ name: '', word: '' }}
        validationSchema={validationSchema}
        onSubmit={(values) => onSubmit(values)}
      >
        <FormField
          name="name"
          placeholder="Enter game name"
          autoCapitalize="none"
          autoFocus={true}
        />
        <FormField name="word" placeholder="Enter the word to guess" />
        <FormField
          name="password"
          leftIcon="lock"
          autoCapitalize="none"
          placeholder="Enter game password (optional)"
          textContentType="password"
        />
        <FormButton title="Create Game" />
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
