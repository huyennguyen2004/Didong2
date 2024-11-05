import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, ImageBackground, View, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native-gesture-handler';

export default function TabTwoScreen() {
  const item = ''; 

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/banner.jpg')} 
        style={styles.categoryBackground}
        imageStyle={{ borderRadius: 8 }} 
      >
        <Text style={styles.categoryText}>{item}</Text>
      </ImageBackground>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>

      <ThemedView style={[styles.sectionContainer, styles.fashionSection]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="shirt" size={24} color="#000" />
          <ThemedText style={styles.blackText} type="title">Fashion</ThemedText>
        </View>
        <ThemedText style={styles.blackText}>Discover the latest fashion trends.</ThemedText>
      </ThemedView>

      <ThemedView style={[styles.sectionContainer, styles.articlesSection]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="newspaper" size={24} color="#000" />
          <ThemedText style={styles.blackText} type="title">Articles</ThemedText>
        </View>
        <ThemedText style={styles.blackText}>Read interesting and useful articles.</ThemedText>
      </ThemedView>

      <ThemedView style={[styles.sectionContainer, styles.vouchersSection]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="card" size={24} color="#000" />
          <ThemedText style={styles.blackText} type="title">Vouchers</ThemedText>
        </View>
        <ThemedText style={styles.blackText}>Catch exciting offers and vouchers.</ThemedText>
      </ThemedView>

      <ThemedView style={[styles.sectionContainer, styles.topPurchasedSection]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="star" size={24} color="#000" />
          <ThemedText style={styles.blackText} type="title">Top Purchases</ThemedText>
        </View>
        <ThemedText style={styles.blackText}>See the most popular products.</ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff', 
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  sectionContainer: {
    marginVertical: 16,
    padding: 16,
    borderRadius: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBackground: {
    height: 200,
    marginVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  blackText: {
    color: '#000', 
  },
  fashionSection: {
    backgroundColor: '#ffebee', 
  },
  articlesSection: {
    backgroundColor: '#e3f2fd', 
  },
  vouchersSection: {
    backgroundColor: '#e8f5e9', 
  },
  topPurchasedSection: {
    backgroundColor: '#fff3e0', 
  },
});
