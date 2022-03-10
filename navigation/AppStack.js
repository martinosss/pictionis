import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import HomeScreen from '../screens/HomeScreen'
import GameScreen from '../screens/GameScreen'
import CreateGameScreen from '../screens/CreateGameScreen'
import { Text, TouchableOpacity } from 'react-native'
import Colors from '../utils/colors'
import GameAuth from '../screens/GameAuth'
import GameWin from '../screens/GameWin'

const Stack = createStackNavigator()

const options = ({ navigation }) => ({
  headerLeft: (props) => (
    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
      <Text
        style={{ color: Colors.primary, fontSize: 17, marginLeft: 10 }}
      >
        Back to Home
      </Text>
    </TouchableOpacity>
  )
})

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen
        options={options}
        name='Game'
        component={GameScreen}
      />
      <Stack.Screen name='GameAuth' component={GameAuth} />
      <Stack.Screen name='CreateGame' component={CreateGameScreen} />
      <Stack.Screen
        name='GameWin'
        component={GameWin}
        options={options}
      />
    </Stack.Navigator>
  )
}
