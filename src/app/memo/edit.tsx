import { 
  View, TextInput, StyleSheet , Alert
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore'

import KeyboardAvoidingView from '../../components/KeyboardAvoidingView'
import CircleButton from '../../components/CircleButton'
import Icon from '../../components/Icon'
import { auth, db } from '../../config'

const handlePress = (id: string, memo: string): void => {
  if (auth.currentUser === null) { return }
  const ref = doc(db, `users/${auth.currentUser.uid}/memos/`, id)
  setDoc(ref, {
    bodyText: memo,
    updatedAt: Timestamp.fromDate(new Date())
  })
  .then(() => {
    router.back()
  })
  .catch((error) => {
    console.log(error)
    Alert.alert('更新に失敗しました')
  })
}

const Edit = (): JSX.Element => {
  const id = String(useLocalSearchParams().id)
  const [memo, setMemo] = useState('')
  useEffect(() => {
    if (auth.currentUser === null) { return }
    const ref = doc(db, `users/${auth.currentUser.uid}/memos/`, id)
    getDoc(ref)
      .then((docRef) => {
        const remoteMemo = docRef?.data()?.bodyText
        setMemo(remoteMemo)
      })
      .catch((error) => {
        console.log(error)
      })
  },[])

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          multiline
          style={styles.input}
          value={memo}
          onChangeText={setMemo}
          autoFocus
        ></TextInput>
      </View>
      <CircleButton onPress={() => { handlePress(id, memo) }}>
        <Icon name="check" size={40} color="#fff" />
      </CircleButton>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  inputContainer: {
    flex: 1
  },
  input: {
    flex: 1,
    textAlignVertical: 'top',
    fontSize: 16,
    lineHeight: 24,
    paddingVertical: 32,
    paddingHorizontal: 27
  }
})

export default Edit
