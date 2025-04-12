import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import axios from 'axios';

const baseURL = 'http://192.168.18.64:5000/api/todos';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const fetchTodos = async () => {
    try {
      const res = await axios.get(baseURL);
      setTodos(res.data);
    } catch (err) {
      console.error('Fetch Todos Error:', err);
    }
  };

  const addTodo = async () => {
    if (newTodo.trim() === '') return;
    try {
      const res = await axios.post(baseURL, { title: newTodo });
      setNewTodo('');
      fetchTodos();
    } catch (err) {
      console.error('Add Todo Error:', err);
    }
  };

  const deleteTodo = async (id) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this todo?", [
      { text: "Cancel" },
      {
        text: "Yes",
        onPress: async () => {
          await axios.delete(`${baseURL}/${id}`);
          fetchTodos();
        }
      }
    ]);
  };

  const toggleTodo = async (id, completed) => {
    await axios.put(`${baseURL}/${id}`, { completed: !completed });
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Text style={styles.heading}>📋 My Todo List</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Write a new task..."
            value={newTodo}
            onChangeText={setNewTodo}
          />
          <TouchableOpacity style={styles.addButton} onPress={addTodo}>
            <Text style={styles.addButtonText}>＋</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={todos}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={styles.todo}>
              <TouchableOpacity onPress={() => toggleTodo(item._id, item.completed)}>
                <Text
                  style={[
                    styles.todoText,
                    item.completed && styles.todoCompleted,
                  ]}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTodo(item._id)}>
                <Text style={styles.deleteButton}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  container: {
    padding: 20,
    paddingTop: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  todo: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  todoText: {
    fontSize: 16,
    color: '#333',
  },
  todoCompleted: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  deleteButton: {
    fontSize: 18,
    color: 'red',
    paddingHorizontal: 10,
  },
});
