import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SessionProvider } from "../context/ctx";

export {
  // Capture quaisquer erros gerados pelo componente Layout.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Certifique-se de que recarregar em `/modal` botão Voltar.
  initialRouteName: "login",
};

// Impedir que a tela inicial seja ocultada automaticamente antes que o carregamento dos ativos seja concluído.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router usa Error Boundaries para capturar erros na árvore de navegação.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}
import { Slot } from "expo-router";
console.log("raiz do app ==============>")
function RootLayoutNav() {
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
