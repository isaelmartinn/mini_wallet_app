import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {MainNavigator} from './navigation';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <MainNavigator />
    </SafeAreaProvider>
  );
}

export default App;
