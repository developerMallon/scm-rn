import { Redirect, Stack } from 'expo-router';
import { useSession } from '../../context/ctx';
import { Text } from 'react-native';

export default function AppLayout() {
  const { session, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    return <Redirect href="/login" />;
  }
  // console.log("layout do auth ==============>")
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ 
        headerShown: false,
        title: "APP Mallon",
      }} />
    </Stack>
  )
}
