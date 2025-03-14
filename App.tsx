import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Button, Clipboard, Alert, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';

type DadosEscanados = {
  tipo: string;
  conteudo: string;
};

function MainAppComponent() {
  const [ladoCamera, setLadoCamera] = useState<CameraType>('back');
  const [permissao, solicitarPermissao] = useCameraPermissions();
  const [dadosEscanados, setDadosEscanados] = useState<DadosEscanados | null>(null);
  const [dadosSalvos, setDadosSalvos] = useState<string[]>([]);
  const [telaAtual, setTelaAtual] = useState<'inicio' | 'escanear' | 'lista'>('inicio');

  useEffect(() => {
    carregarDadosSalvos();
  }, []);

  const carregarDadosSalvos = async () => {
    try {
      const salvos = await AsyncStorage.getItem('dadosEscanados');
      if (salvos !== null) {
        setDadosSalvos(JSON.parse(salvos));
      }
    } catch (e) {
      console.error('Falha ao carregar dados salvos.', e);
    }
  };

  const salvarDados = async (dados: string) => {
    try {
      const novosDadosSalvos = [...dadosSalvos, dados];
      await AsyncStorage.setItem('dadosEscanados', JSON.stringify(novosDadosSalvos));
      setDadosSalvos(novosDadosSalvos);
    } catch (e) {
      console.error('Falha ao salvar dados.', e);
    }
  };

  const deletarDados = async (indice: number) => {
    try {
      const novosDadosSalvos = dadosSalvos.filter((_, i) => i !== indice);
      await AsyncStorage.setItem('dadosEscanados', JSON.stringify(novosDadosSalvos));
      setDadosSalvos(novosDadosSalvos);
    } catch (e) {
      console.error('Falha ao deletar dados.', e);
    }
  };

  const deletarTodosDados = async () => {
    try {
      await AsyncStorage.removeItem('dadosEscanados');
      setDadosSalvos([]);
    } catch (e) {
      console.error('Falha ao deletar todos os dados.', e);
    }
  };

  const copiarParaAreaTransferencia = (texto: string) => {
    Clipboard.setString(texto);
    alert('Conteúdo copiado para a área de transferência!');
  };

  const alternarLadoCamera = useCallback(() => {
    setLadoCamera(atual => (atual === 'back' ? 'front' : 'back'));
  }, []);

  const aoEscanearCodigo = useCallback((dados: any) => {
    const conteudoEscanado = dados.data;

    if (!dadosSalvos.includes(conteudoEscanado)) {
      setDadosEscanados({ tipo: dados.type, conteudo: conteudoEscanado });
      salvarDados(conteudoEscanado);
    }
  }, [dadosSalvos]);

  const confirmarDeletarTodos = () => {
    Alert.alert(
      "Deletar Todos",
      "Tem certeza que deseja deletar todos os dados?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { text: "Deletar", onPress: () => deletarTodosDados() }
      ]
    );
  };

  if (!permissao) {
    return <View />;
  }

  if (!permissao.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.mensagem}>Precisa dar permissão para acessar a câmera</Text>
        <Button onPress={solicitarPermissao} title="Conceder permissão" />
      </View>
    );
  }

  const renderizarTelaInicio = () => (
    <View style={styles.containerInicio}>
      <Image source={require('./assets/icon.png')} style={styles.icon} />
      <TouchableOpacity style={styles.botaoInicio} onPress={() => setTelaAtual('escanear')}>
        <Text style={styles.textoBotaoInicio}>Escanear</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.botaoInicio} onPress={() => setTelaAtual('lista')}>
        <Text style={styles.textoBotaoInicio}>Lista dos Escaneados</Text>
      </TouchableOpacity>
    </View>
  );

  const renderizarTelaEscanear = () => (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={ladoCamera} onBarcodeScanned={aoEscanearCodigo}>
        <View style={styles.containerBotoes}>
          <TouchableOpacity style={styles.botao} onPress={alternarLadoCamera}>
            <Text style={styles.texto}>Virar Câmera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      {dadosEscanados && (
        <View style={styles.containerInfo}>
          <Text style={styles.textoInfo}>Conteúdo: {dadosEscanados.conteudo}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.botaoIrParaLista} onPress={() => setTelaAtual('lista')}>
        <Text style={styles.textoBotaoIrParaLista}>Ir para Lista</Text>
      </TouchableOpacity>
    </View>
  );

  const renderizarTelaLista = () => (
    <View style={styles.container}>
      <Text style={styles.tituloLista}></Text>
      <Text style={styles.tituloLista}>Lista QR</Text>
      <TouchableOpacity style={styles.botaoDeletarTodos} onPress={confirmarDeletarTodos}>
        <Text style={styles.textoBotaoDeletarTodos}>Deletar Todos</Text>
      </TouchableOpacity>
      <ScrollView style={styles.containerDadosSalvos}>
        {dadosSalvos.map((dados, indice) => (
          <View key={indice} style={styles.itemDadosSalvos}>
            <Text style={styles.textoDadosSalvos}>{dados}</Text>
            <Menu>
              <MenuTrigger>
                <Text style={styles.triggerMenu}>...</Text>
              </MenuTrigger>
              <MenuOptions>
                <MenuOption onSelect={() => copiarParaAreaTransferencia(dados)}>
                  <Text style={styles.textoOpcaoMenu}>Copiar Conteúdo</Text>
                </MenuOption>
                <MenuOption onSelect={() => deletarDados(indice)}>
                  <Text style={styles.textoOpcaoMenuDeletar}>Deletar</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.botaoVoltarParaEscanear} onPress={() => setTelaAtual('escanear')}>
        <Text style={styles.textoBotaoVoltarParaEscanear}>Voltar para Escanear</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {telaAtual === 'inicio' && renderizarTelaInicio()}
      {telaAtual === 'escanear' && renderizarTelaEscanear()}
      {telaAtual === 'lista' && renderizarTelaLista()}
    </View>
  );
}

export default function App() {
  return (
    <MenuProvider>
      <MainAppComponent />
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  containerInicio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 100,  // Ajuste o tamanho conforme necessário
    height: 100, // Ajuste o tamanho conforme necessário
    marginBottom: 20, // Espaçamento abaixo do ícone
  },
  botaoInicio: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  textoBotaoInicio: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mensagem: {
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 18,
  },
  camera: {
    flex: 1,
  },
  containerBotoes: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  botao: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  texto: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  containerInfo: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 5,
  },
  textoInfo: {
    color: 'white',
    fontSize: 16,
  },
  containerDadosSalvos: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 10,
  },
  itemDadosSalvos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 5,
    borderRadius: 5,
    elevation: 2,
  },
  textoDadosSalvos: {
    fontSize: 16,
  },
  triggerMenu: {
    fontSize: 24,
    color: '#007BFF',
  },
  textoOpcaoMenu: {
    fontSize: 16,
    padding: 10,
  },
  textoOpcaoMenuDeletar: {
    fontSize: 16,
    padding: 10,
    color: 'red',
  },
  botaoIrParaLista: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  textoBotaoIrParaLista: {
    color: 'white',
    fontSize: 16,
  },
  botaoVoltarParaEscanear: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  textoBotaoVoltarParaEscanear: {
    color: 'white',
    fontSize: 16,
  },
  tituloLista: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  botaoDeletarTodos: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 10,
  },
  textoBotaoDeletarTodos: {
    color: 'white',
    fontSize: 16,
  },
});