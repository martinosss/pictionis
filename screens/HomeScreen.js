import React, { useContext, useEffect, useState } from 'react'
import { View, StyleSheet, Button, Text, ScrollView } from 'react-native'

import useStatusBar from '../hooks/useStatusBar'
import { logout } from '../components/Firebase/firebase'
import { AuthUserContext } from '../navigation/AuthUserProvider'
import { database } from '../components/Firebase/firebase'
import AppButton from '../components/AppButton'
import Colors from '../utils/colors'

export default function HomeScreen({ navigation }) {
  useStatusBar('dark-content')
  const { user } = useContext(AuthUserContext)
  const [games, setGames] = useState([])

  async function handleSignOut() {
    try {
      await logout()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const gamesRef = database.ref('games').on('value', (games) => {
      setGames(games.val())
    })

    return () => database.ref('games').off('value', gamesRef)
  }, [])

  return (
    <ScrollView style={styles.container}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 20,
          fontWeight: 'bold',
          color: Colors.black,
        }}
      >
        Welcome {user.name} (Won games: {user.gamesWinCount || 0})
      </Text>
      {/*<Button*/}
      {/*  title="Clear games"*/}
      {/*  onPress={() => database.ref('games').remove()}*/}
      {/*/>*/}
      <Button title="Sign Out" onPress={handleSignOut} />
      <AppButton
        title="create new game"
        onPress={() => navigation.navigate('CreateGame')}
      />
      <Text
        style={{
          textAlign: 'center',
          fontSize: 20,
          fontWeight: 'bold',
          color: Colors.ghostWhite,
        }}
      >
        Available Games:
      </Text>
      {Object.keys(games || []).map((key, i) => (
        <AppButton
          key={i}
          title={`${games[key].name} [${
            games[key].password ? 'PASSWORD' : 'FREE'
          }]`}
          onPress={() =>
            navigation.navigate(
              games[key].password && games[key].createdBy !== user.uid
                ? 'GameAuth'
                : 'Game',
              {
                game: { ...games[key], uid: key },
              }
            )
          }
        />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.mediumGrey,
  },
})
