# Speech to Command App

React Native application that uses voice recognition to listen for defined commands and show data on the screen 

## Functionalities
1. Transform speech into commands (code/count/back/reset)
2. Possibility to add future commands
3. Possibility to add other languages (implemented English and German)
4. Waiting/listening states
5. Accepting digits as parameters

## Packages
1. react-native-voice: for speech recognition
2. react-native-picker-select: language selector
3. react-i18next: translations


## Installation

```bash
# install the dependencies
npm install
cd ios
pod install
cd ..

# run the application on iOS simulator
npm run ios

```

## Improvements
1. Adding multiple digits one by one for the commands doesn't work properly due to the package used. In case the command needs to have multiple digits, it works the best if you say a digit, than any other word, than again a digit etc
2. The application has a bug regarding translations when you want to switch languages. Changing the language only works when pressing  “done” button from the dropdown  two times. The first press changes the texts, but in order for the recognition to work, another button press is needed. I couldn’t yet figure it out why this is happening and what is the solution for it.
3. Testing on Android (the app was tested only on iOS)