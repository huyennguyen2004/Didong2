import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, Pressable, FlatList, StyleSheet, ImageBackground, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Product = {
  id: number;
  title: string;
  price: string;
  image: string;
  attributes: { color: string; size: string };
  description: string;
  category: string;
};

type RootStackParamList = {
  index: undefined;
  ProductDetail: { productId: number };
  Profile: { username?: string };
};

const { width } = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAllProducts, setShowAllProducts] = useState<boolean>(false);
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [cart, setCart] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(''); 
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const categoryImages: { [key: string]: ImageSourcePropType } = {
    "electronics": require('@/assets/images/5.jpg'),
    "jewelery": require('@/assets/images/6.jpg'),
    "men's clothing": require('@/assets/images/7.jpg'),
    "women's clothing": require('@/assets/images/9.jpg'),
  };

  const banners = [
    require('@/assets/images/banner1.jpg'),
    require('@/assets/images/banner.jpg'),
  ];

  const addToCart = async (product: Product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(item => item.id === product.id);
      if (existingProduct) {
        console.log(`Product ${product.title} already in cart`);
        return prevCart;
      }
      const updatedCart = [...prevCart, product];
      saveCartToAsyncStorage(updatedCart); 
      return updatedCart;
    });
  };
  
  const saveCartToAsyncStorage = async (cart: Product[]) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart to storage:', error);
    }
  };

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartData = await AsyncStorage.getItem('cart');
        if (cartData) {
          setCart(JSON.parse(cartData));
        }
      } catch (error) {
        console.error('Error loading cart data:', error);
      }
    };
    loadCart();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoryRes, productRes] = await Promise.all([
          fetch('https://fakestoreapi.com/products/categories'),
          fetch('https://fakestoreapi.com/products'),
        ]);
        const categoriesData = await categoryRes.json();
        const productsData = await productRes.json();
        setCategories(categoriesData);
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };
  
  const renderBanner = () => (
    <View style={styles.sliderBanner}>
      <Image source={banners[activeSlide]} style={styles.bannerImage} resizeMode="cover" />
    </View>
  );

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.title}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
      </View>
      <Pressable onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}>
        <Ionicons name="eye-outline" size={24} color="black" style={styles.eyeIcon} />
      </Pressable>
      <Ionicons name="heart-outline" size={24} color="black" style={styles.heartIcon} />
      
      <Pressable onPress={() => addToCart(item)}>
        <Ionicons name="cart-outline" size={24} color="black" />
      </Pressable>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('@/assets/images/21.jpeg')} style={styles.logo} />
        <View style={styles.iconContainer}>
          <Pressable style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="black" />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Ionicons name="heart-outline" size={24} color="black" />
          </Pressable>
        </View>
      </View>

      <View style={styles.searchContainer}>
         <Ionicons name="search" size={24} color="gray" style={styles.searchIcon} />
  <TextInput
    style={styles.searchInput}
    placeholder="Search..."
    value={searchQuery}
    onChangeText={handleSearch}
  />
  <Ionicons name="filter" size={24} style={styles.filterIcon} />
      </View>

      {renderBanner()}

      <View style={styles.categoriesContainer}>
        <View style={styles.categoryHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <Pressable>
            <Ionicons name="chevron-forward" size={16} color="black" />
          </Pressable>
        </View>
        <FlatList
          data={categories}
          horizontal
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable style={styles.categoryButton}>
              <ImageBackground
                source={categoryImages[item]}
                style={styles.categoryBackground}
                imageStyle={{ borderRadius: 8 }}
              />
              <Text style={styles.categoryText}>{item}</Text>
            </Pressable>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.productsContainer}>
        <View style={styles.productHeader}>
          <Text style={styles.sectionTitle}>Products</Text>
          <Pressable onPress={() => setShowAllProducts(!showAllProducts)}>
            <Text style={styles.seeAllText}>{showAllProducts ? 'Hide' : 'See All'}</Text>
          </Pressable>
        </View>
        <FlatList
  data={showAllProducts ? filteredProducts : filteredProducts.slice(0, 4)}
  renderItem={renderProductItem}
  keyExtractor={(item) => item.id.toString()}
/>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  logo: {
    width: 50,
    height: 50,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  filterIcon: {
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    padding: 8,
  },
  sliderBanner: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryButton: {
    marginRight: 10,
    borderRadius: 8,
  },
  categoryBackground: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00CCFF',
  },
  productsContainer: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007BFF',
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    padding: 20,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#777',
  },
  eyeIcon: {
    marginLeft: 10,
  },
  heartIcon: {
    marginLeft: 10,
  },
  cartIcon: {
    marginLeft: 10,
  },
});

export default Home;
