import React from 'react'
import AppBody from '../AppBody'
import NavigationTabs from '../../components/NavigationTabs'

export default function Farm(): React.ReactElement {
  return (
    <AppBody>
      <NavigationTabs active={'farm'} />
    </AppBody>
  );
}