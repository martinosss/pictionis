import React, { useContext, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import AppButton from '../components/AppButton'
import { AuthUserContext } from '../navigation/AuthUserProvider'
import { database } from '../components/Firebase/firebase'

export default function GameWin({ route, navigation }) {
  const { winner, game } = route.params
  const { user, setUser } = useContext(AuthUserContext)
  const userHasWon = user.uid === winner.createdBy
  
  useEffect(() => {
    if (userHasWon) {
      ;(async () => {
        const totalWin = (user.gamesWinCount || 0) + 1
        database.ref(`users/${user.uid}`).update({
          gamesWinCount: totalWin
        })
        setUser({
          ...user,
          gamesWinCount: totalWin
        })
        database.ref(`games/${game.uid}`).remove()
      })()
    }
  }, [])
  
  return (
    <View style={{ padding: 20 }}>
      <Text style={styles.text}>{game.name}</Text>
      
      {userHasWon ? (
        <Text style={styles.text}>
          Congrats {winner.name} you won the game !
        </Text>
      ) : (
        <Text style={styles.text}>
          {winner.name} found the word{' '}
          <Text style={{ fontWeight: 'bold' }}>{game.word}</Text> and won the
          game
        </Text>
      )}
      
      <AppButton title='Go home' onPress={() => navigation.navigate('Home')} />
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20
  }
})
