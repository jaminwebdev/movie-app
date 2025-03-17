import { Text } from 'react-native'
import React from 'react'
import { useUser } from '../../context/UserContext'
import { SafeAreaView } from 'react-native-safe-area-context'

const Saved = () => {
  
  const { userId } = useUser()

  return (
    <SafeAreaView>
      <Text>{userId}</Text>
    </SafeAreaView>
  )
}

export default Saved