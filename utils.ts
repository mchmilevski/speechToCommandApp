import i18next from "i18next";

const Digits = {
  zeroWord: "digits.zero",
  zeroDigit: "0",
  oneWord: "digits.one",
  oneDigit: "1",
  twoWord: "digits.two",
  twoDigit: "2",
  threeWord: "digits.three",
  threeDigit: "3",
  fourWord: "digits.four",
  fourDigit: "4",
  fiveWord: "digits.five",
  fiveDigit: "5",
  sixWord: "digits.six",
  sixDigit: "6",
  sevenWord: "digits.seven",
  sevenDigit: "7",
  eightWord: "digits.eight",
  eightDigit: "8",
  nineWord: "digits.nine",
  nineDigit: "9"
}

export const Command = {
  code: "code",
  count: "count",
  reset: "reset",
  back: "back",
  undefined: ''
}

export enum Languages {
  en = 'en-GB',
  de = 'de-DE'
}

export const pickerLanguages = [
  { label: "English", value: Languages.en },
  { label: "German", value: Languages.de }
]

export const convertTextToNumber = (text: string) => {
  switch (text) {
    case i18next.t(Digits.zeroWord):
    case Digits.zeroDigit:
      return 0
    case i18next.t(Digits.oneWord):
    case Digits.oneDigit:
      return 1
    case i18next.t(Digits.twoWord):
    case Digits.twoDigit:
      return 2
    case i18next.t(Digits.threeWord):
    case Digits.threeDigit:
      return 3
    case i18next.t(Digits.fourWord):
    case Digits.fourDigit:
      return 4
    case i18next.t(Digits.fiveWord):
    case Digits.fiveDigit:
      return 5
    case i18next.t(Digits.sixWord):
    case Digits.sixDigit:
      return 6
    case i18next.t(Digits.sevenWord):
    case Digits.sevenDigit:
      return 7
    case i18next.t(Digits.eightWord):
    case Digits.eightDigit:
      return 8
    case i18next.t(Digits.nineWord):
    case Digits.nineDigit:
      return 9
    default:
      return undefined
  }
}

export type CommandAndValue = {
  command: string,
  value: string
}

export const initialStateCommand: CommandAndValue = {
  command: '',
  value: ''
}