import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CarregandoApp from "./telas/CarregandoApp";
import CriarConta from "./telas/criarConta";
import Login from "./telas/login";
import RecuperacaoSenha from "./telas/recuperacaoSenha";
import InicioADM from "./telas/admin/inicioAdmin";
import EnsaiosADM from "./telas/admin/ensaios";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CarregandoApp">
        <Stack.Screen
          name="CarregandoApp"
          component={CarregandoApp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        
        <Stack.Screen
          name="CadastroUsuario"
          component={CriarConta}
          options={{ headerBackTitleVisible: false, title: '' }}
        />
        
        <Stack.Screen
          name="RecuperacaoSenha"
          component={RecuperacaoSenha}
          options={{ headerBackTitleVisible: false, title: '' }}
        />

        <Stack.Screen
          name="EnsaiosADM"
          component={EnsaiosADM}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InicioADM"
          component={InicioADM}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
