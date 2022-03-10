import React, { useEffect, useState } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { useContext } from 'react'
import { AuthUserContext } from '../../navigation/AuthUserProvider'
import { database } from '../Firebase/firebase'
import { View } from 'react-native'

export default function Chat({ game }) {
  const [messages, setMessages] = useState([])
  const basePath = `games/${game.uid}/messages`
  const { user } = useContext(AuthUserContext)
  const isAuthGame = user.uid === game.createdBy

  useEffect(() => {
    const onMessageAdded = database
      .ref(basePath)
      .on('child_added', (message) =>
        setMessages((previousMessages) => [message.val(), ...previousMessages])
      )

    return () =>
      database.ref(basePath).off('child_changed', onMessageAdded)
  }, [])

  const sendMessage = (message) => database.ref(basePath).push(message)

  return (
    <View style={{ width: '100%', height: isAuthGame ? 300 : 190 }}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => sendMessage(messages[0])}
        user={{
          _id: user.uid,
          name: user.name,
        }}
      />
    </View>
  )
}
