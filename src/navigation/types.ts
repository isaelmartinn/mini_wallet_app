export type AuthStackParamList = {
  Login: undefined;
};

export type AppStackParamList = {
  Home: undefined;
  Amount: undefined;
  Recipient: undefined;
  Summary: undefined;
  Result: undefined;
  Timeout: undefined;
};

export type RootStackParamList = AuthStackParamList & AppStackParamList;
