import "./translations";
import i18n from "./translations";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Platform } from 'react-native';
import Voice from "@react-native-voice/voice";
import { convertTextToNumber, Command, CommandAndValue, initialStateCommand, Languages, pickerLanguages } from './utils';
import RNPickerSelect from 'react-native-picker-select';

export default function App() {
  const { t } = useTranslation();
  const [speech, _setSpeech] = useState('');
  const [commands, setCommands] = useState<CommandAndValue[]>([]);
  const [currentCommand, _setCurrentCommand] = useState(initialStateCommand)
  const [currentLanguage, setCurrentLanguage] = useState<Languages>(Languages.en)

  let speechTimer: ReturnType<typeof setTimeout>;

  // Last registered command ref
  const currentCommandRef = useRef(currentCommand);
  const setCurrentCommand = (data: CommandAndValue) => {
    currentCommandRef.current = data;
    _setCurrentCommand(data)
  }

  //  Speech ref
  const speechRef = useRef(speech)
  const setSpeech = (text: string) => {
    speechRef.current = text;
    _setSpeech(text)
  }

  // Initialize listeners and start recording on component mount
  useEffect(() => {
    Voice.onSpeechResults = speechResultsHandler;
    startRecording()

    // Remove listeners on unmount 
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
      clearTimeout(speechTimer);
    };
  }, []);

  const startRecording = async () => {
    try {
      await Voice.start(currentLanguage)
    } catch (error) {
      console.log('error', error);
    }
  };

  const speechResultsHandler = (e: any) => {
    const text = e.value[0];

    // Subtract last word from speech because text contains all the spoken words
    let currentWord = text.split(' ').pop().toLowerCase().trim();
    console.log(currentWord)
    let currentDigit = convertTextToNumber(currentWord)
    console.log(currentDigit)

    // Timeout used to handle current command if no speech is detected for 5 seconds
    clearTimeout(speechTimer)
    speechTimer = setTimeout(() => {
      onCommandFinish()
    }, 5000)

    onReset(currentWord)
    onBack(currentWord)
    onCommand(currentWord)
    onDigit(currentDigit)

    setSpeech(text);
  };

  const onReset = (currentWord: string) => {
    if (currentWord !== t(Command.reset)) return

    setCurrentCommand(initialStateCommand)
  }

  const onBack = (currentWord: string) => {
    if (currentWord !== t(Command.back)) return

    setCommands(prevCommands => prevCommands.slice(0, -1))
    setCurrentCommand(initialStateCommand)
  }

  const onCommand = (currentWord: string) => {
    if (currentWord !== t(Command.code) && currentWord !== t(Command.count)) return

    // Starting a new command saves the previous command with values in commands list
    onCommandFinish()
    // Update state with new command
    setCurrentCommand({ command: currentWord, value: '' })
  }

  const isCurrentCommandAcceptingDigits = () => currentCommandRef.current.command === t(Command.code) || currentCommandRef.current.command === t(Command.count)

  const onDigit = (currentDigit: number | undefined) => {
    console.log(currentDigit, "digit")

    if (currentDigit === undefined || !isCurrentCommandAcceptingDigits()) return

    const newValue = currentCommandRef.current.value + String(currentDigit)
    setCurrentCommand({ ...currentCommandRef.current, value: newValue })
  }

  // Update commands list with new command and reset to initial state last registered command
  const onCommandFinish = () => {
    // If we have other commands with other scopes (eg add) we can handle them here before adding them to commands list

    if (currentCommandRef.current.command && currentCommandRef.current.value) {
      setCommands(prevCommands => [...prevCommands, currentCommandRef.current])
    }

    setCurrentCommand(initialStateCommand)
    setSpeech('')
  }

  const stopAndRestartRecording = async () => {
    try {
      await Voice.cancel();
      await Voice.stop();
      await startRecording();
    } catch (error) {
      console.log('error', error);
    }
  }

  const changeLanguageAndRestartVoice = async () => {
    switch (currentLanguage) {
      case Languages.de:
        await i18n.changeLanguage("de");
        break;
      case Languages.en:
      default:
        await i18n.changeLanguage("en")
    }

    await clearTimeout(speechTimer);
    await setSpeech('')
    await setCommands([])
    await stopAndRestartRecording()
  }

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView style={{ marginHorizontal: 20 }}>
          <Text style={styles.headingText}>{t("speechToCommandRecognition")}</Text>
          <RNPickerSelect
            value={currentLanguage}
            placeholder={{
              label: 'Select a language...',
              value: Languages.en,
              color: 'black',
            }}
            style={pickerSelectStyles}
            onValueChange={setCurrentLanguage}
            onDonePress={changeLanguageAndRestartVoice}
            items={pickerLanguages}
          />
          <View style={styles.statusContainer}>
            <Text style={{ fontWeight: 'bold' }}>{t("currentStatus")}</Text>
            <Text>{t("status")}: {currentCommand.command}</Text>
            <Text>{t("parameters")}: {currentCommand.value}</Text>
          </View>
          <View style={styles.speechContainer}>
            <Text style={{ fontWeight: 'bold' }}>{t("currentSpeech")}</Text>
            <Text>{speech}</Text>
          </View>
          <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>{t("values")}:</Text>
          {
            commands.map((command, index) => (
              <View key={index} style={styles.commandContainer}>
                <Text>{t("command")}: {command.command}</Text>
                <Text>{t("value")}: {command.value}</Text>
              </View>
            ))
          }
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
  headingText: {
    textAlign: 'center',
    marginVertical: 26,
    fontWeight: 'bold',
    fontSize: 24,
  },
  commandContainer: {
    width: '100%',
    padding: 20,
    marginBottom: 10,
    backgroundColor: "#F7F1E6"
  },
  speechContainer: {
    backgroundColor: "#C9EFFA",
    width: '100%',
    padding: 20,
    marginBottom: 20
  },
  statusContainer: {
    backgroundColor: '#C8F7DB',
    width: '100%',
    padding: 20,
    marginBottom: 20
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    marginBottom: 20,
  },
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    marginBottom: 20,
  },
})