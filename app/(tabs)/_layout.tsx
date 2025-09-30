import React from 'react';
import { Slot } from 'expo-router';

// Este layout apenas delega para as rotas filhas do diretório (tabs).
export default function TabsLayout() {
  return <Slot />;
}
