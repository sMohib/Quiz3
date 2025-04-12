import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import axios from 'axios';

const baseURL = 'http://192.168.18.64:5000/api/todos';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const fetchTodos = async () => {
    const res = await axios.get(baseURL);
    setTodos(res.data);
  };

  const addTodo = async () => {
    if (newTodo.trim() === '') return;
    await axios.post(baseURL, { title: newTodo });
    setNewTodo('');
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${baseURL}/${id}`);
    fetchTodos();
  };

  const toggleTodo = async (id, completed) => {
    await axios.put(`${baseURL}/${id}`, { completed: !completed });
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Add todo..."
        value={newTodo}
        onChangeText={setNewTodo}
      />
      <Button title="Add" onPress={addTodo} />

      <FlatList
        data={todos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.todo}>
            <Text
              onPress={() => toggleTodo(item._id, item.completed)}
              style={{
                textDecorationLine: item.completed ? 'line-through' : 'none',
              }}
            >
              {item.title}
            </Text>
            <Button title="Delete" onPress={() => deleteTodo(item._id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 40 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10,
  },
  todo: {
    padding: 10, borderBottomWidth: 1, borderColor: '#ccc', flexDirection: 'row', justifyContent: 'space-between',
  },
});
