import { Slot } from 'expo-router';
import React from 'react';

// Este layout apenas delega para as rotas filhas do diretório (tabs).
export default function TabsLayout() {
  return <Slot />;
}
