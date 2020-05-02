import React, { useEffect, useState } from "react";
import api from './services/api'


import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get(`repositories`).then(response => {
      const { data: repositories } = response;
      setRepositories(repositories)
    })
  }, []);

  async function handleAddRepository() {
    const newrepo = {
      url: "https://github.com/josepholiveira",
      title: `Desafio ReactJS ${repositories.length}`,
      techs: ["React", "Node.js"],
    };

    const repo = await api.post(`repositories`, newrepo)

    setRepositories([...repositories, repo.data]);
  }

  async function handleRemoveRepository(id) {
    await api.delete(`repositories/${id}`)
    const index = repositories.findIndex(item => item.id === id)
    repositories.splice(index, 1)
    setRepositories([...repositories]);
  }

  async function handleLikeRepository(id) {
    const repo = await api.post(`repositories/${id}/like`)
    const index = repositories.findIndex(item => item.id === id)
    repositories[index] = repo.data
    setRepositories([...repositories]);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />

      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.buttonAdd}
          onPress={handleAddRepository}
        >
          <Text style={styles.buttonTextAdd}>Adicionar</Text>
        </TouchableOpacity>
        <FlatList
          data={repositories}
          keyExtractor={repo => repo.id}
          renderItem={({ item: repo }) => (
            <View style={styles.repositoryContainer}>

              <Text style={styles.repository}>{repo.title}</Text>

              <View style={styles.techsContainer}>
                {repo.techs && repo.techs.map(tech => (
                  <Text key={tech} style={styles.tech}>
                    {tech}
                  </Text>
                ))}
              </View>
              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                  testID={`repository-likes-${repo.id}`}
                >
                  {repo.likes} {repo.likes === 1 ? `curtida` : `curtidas`}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repo.id)}
                // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                testID={`like-button-${repo.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleRemoveRepository(repo.id)}
                // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                testID={`remove-button-${repo.id}`}
              >
                <Text style={styles.buttonText}>Remover</Text>
              </TouchableOpacity>

            </View>
          )
          }
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },

  buttonAdd: {
    margin: 10,
  },

  buttonTextAdd: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 5,
    marginLeft: 5,
    color: "#7159c1",
    backgroundColor: "#04d361",
    padding: 15,
  },
});
