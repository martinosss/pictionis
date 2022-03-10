import React, { useContext, useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import Draw from '../components/Draw/Draw'
import Chat from '../components/Chat/Chat'
import ColorPicker from '../components/ColorPicker/ColorPicker'
import { fromHsv, toHsv } from 'react-native-color-picker'
import Colors from '../utils/colors'
import Form from '../components/Forms/Form'
import FormField from '../components/Forms/FormField'
import FormButton from '../components/Forms/FormButton'
import { AuthUserContext } from '../navigation/AuthUserProvider'
import * as Yup from 'yup'
import { database } from '../components/Firebase/firebase'

const validationSchema = Yup.object().shape({
  word: Yup.string(),
})

export default function GameScreen({ navigation, route }) {
  const { game } = route.params
  const { user } = useContext(AuthUserContext)
  const [strokeColor, setStrokeColor] = useState(toHsv('red'))
  const [showColorPicker, setShowColorPicker] = useState()
  const isAuthGame = user.uid === game.createdBy
  const winnerPath = `games/${game.uid}/winner`

  useEffect(() => {
    if (!game) navigation.navigate('Home')

    const onWin = database.ref(winnerPath).on('child_added', (winner) =>
      navigation.navigate('GameWin', {
        winner: winner.val(),
        game,
      })
    )

    return () => database.ref(winnerPath).off('child_added', onWin)
  }, [])

  const onSubmit = ({ word }) => {
    if (word?.toLowerCase() === game.word.toLowerCase()) {
      database.ref(winnerPath).push({
        createdBy: user.uid,
        name: user.name,
      })
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, display: showColorPicker ? 'flex' : 'none' }}>
        <ColorPicker
          color={strokeColor}
          onColorChange={(color) => setStrokeColor(color)}
          onClose={() => setShowColorPicker(false)}
        />
      </View>
      <View style={{ flex: 1, display: showColorPicker ? 'none' : 'flex' }}>
        <Draw
          game={game}
          setShowColorPicker={setShowColorPicker}
          strokeColor={fromHsv(strokeColor)}
        />
        {!isAuthGame && (
          <View
            style={{
              padding: 5,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Form
              initialValues={{ word: '' }}
              validationSchema={validationSchema}
              onSubmit={(values) => onSubmit(values)}
            >
              <FormField
                name="word"
                width={'67%'}
                placeholder="Enter the word to guess"
              />
              <FormButton title="Submit" style={{ width: '30%' }} />
            </Form>
          </View>
        )}
        <Chat game={game} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mediumGrey,
  },
})
