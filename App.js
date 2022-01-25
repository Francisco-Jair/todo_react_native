import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
  AsyncStorage,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function App() {
  const [task, setTask] = useState([]);
  const [newtask, setNewtask] = useState("");

  async function addTask() {
    if (newtask === "") {
      return;
    }

    const search = task.filter((task) => task === newtask);

    if (search.length !== 0) {
      Alert.alert("Atenção", "Nome da tarefa repetido!");
      return;
    }

    setTask([...task, newtask]);
    setNewtask("");

    // para despensar o teclado quando add
    Keyboard.dismiss();
  }

  async function removerTask(item) {
    Alert.alert(
      "Deletar Task",
      "Tem certeza que deseja remover essa anotação?",
      [
        {
          text: "Cancel",
          onPress: () => {
            return;
          },
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => setTask(task.filter((tasks) => tasks !== item)),
        },
      ],
      { cancelable: false }
    );
  }

  // carregar dados
  useEffect(() => {
    async function carregarDados() {
      const task = await AsyncStorage.getItem("task");
      if (task) {
        setTask(JSON.parse(task));
      }
    }
    carregarDados();
  }, []);

  // salvar
  useEffect(() => {
    async function salvarDados() {
      AsyncStorage.setItem("task", JSON.stringify(task));
    }
    salvarDados();
  }, [task]);

  return (
    <>
      <KeyboardAvoidingView
        keyboardVerticalOffset={0}
        behavior="padding"
        style={{ flex: 1 }}
        enabled={Platform.OS === "ios"}
      >
        <View style={styles.container}>
          <View style={styles.body}>
            <FlatList
              style={styles.flatlist}
              data={task}
              keyExtractor={(item) => item.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.containerView}>
                  <Text style={styles.texto}>{item}</Text>
                  <TouchableOpacity onPress={() => removerTask(item)}>
                    <MaterialIcons
                      name="delete-forever"
                      size={25}
                      color="#f64c75"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            <StatusBar style="auto" />
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholderTextColor="#999"
              autoCorrect={true}
              placeholder="Adicione uma tarefa"
              maxLength={25}
              onChangeText={(text) => setNewtask(text)}
              value={newtask}
            />
            <TouchableOpacity style={styles.botao}>
              <Ionicons
                name="ios-add"
                size={25}
                color="#FFF"
                onPress={() => addTask()}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20,
  },
  body: {
    flex: 1,
  },
  form: {
    padding: 0,
    height: 60,
    justifyContent: "center",
    alignSelf: "stretch",
    flexDirection: "row",
    paddingTop: 13,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#eee",
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  botao: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c6cce",
    borderRadius: 4,
    marginLeft: 10,
  },
  flatlist: {
    flex: 1,
    marginTop: 5,
  },
  containerView: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 4,
    backgroundColor: "#eee",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#eee",
  },
  texto: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
    marginTop: 4,
    textAlign: "center",
  },
});
