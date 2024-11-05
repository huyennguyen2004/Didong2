import { View, Text, Image, StyleSheet, ActivityIndicator, TextInput, Button, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProductDetailRouteProp = RouteProp<{ params: { productId: number } }, 'params'>;

const ProductDetail = () => {
  const route = useRoute<ProductDetailRouteProp>(); 
  const { productId } = route.params;
  const navigation = useNavigation();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [comment, setComment] = useState<string>('');
  const [comments, setComments] = useState<{username: string, comment: string}[]>([
    { username: 'User1', comment: 'Great product!' },
    { username: 'User2', comment: 'I really like the color of this product.' },
    { username: 'User3', comment: 'Good quality but a bit expensive.' },
    { username: 'User4', comment: 'I bought this product and I am very satisfied.' },
    { username: 'User5', comment: 'A great choice for fashion lovers.' }
  ]);
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        const data = await response.json();
        setProduct(data);

        if (data.category) {
          const relatedResponse = await fetch(`https://fakestoreapi.com/products/category/${data.category}`);
          const relatedData = await relatedResponse.json();
          setRelatedProducts(relatedData.filter((item: any) => item.id !== productId).slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    loadCart();
  }, [productId]);

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

  const addToCart = async (product: Product) => {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
      console.log(`Product ${product.title} already in cart`);
      return;
    }
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    console.log(`Product ${product.title} added to cart`);
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      setComments([...comments, { username: 'You', comment }]);
      setComment('');
    }
  };
  
  const handleBuyNow = () => {
    console.log('Buy now:', product);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={20}
          color={i <= rating ? "gold" : "gray"}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Product not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>{`$${product.price}`}</Text>
      <View style={styles.ratingContainer}>
        {renderStars(Math.round(product.rating.rate))}
      </View>
      <Text style={styles.description}>{product.description}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
          <Text style={styles.buttonText}>Buy Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(product)}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.relatedTitle}>Related Products</Text>
      <FlatList
        data={relatedProducts}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.relatedItem} onPress={() => navigation.replace('ProductDetail', { productId: item.id })}>
            <Image source={{ uri: item.image }} style={styles.relatedImage} />
            <Text style={styles.relatedText}>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
      />

      <View style={styles.commentContainer}>
        <TextInput 
          style={styles.commentInput} 
          placeholder="Add a comment..." 
          value={comment} 
          onChangeText={setComment} 
        />
        <Button title="Send" onPress={handleAddComment} />
      </View>
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Ionicons name="person-circle" size={30} color="gray" />
            <View style={styles.commentTextContainer}>
              <Text style={styles.usernameText}>{item.username}</Text>
              <Text style={styles.commentText}>{item.comment}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  relatedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  relatedItem: {
    width: 120,
    marginRight: 10,
    alignItems: 'center',
  },
  relatedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  relatedText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    color: 'green',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  commentContainer: {
    marginTop: 20,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 5,
  },
  commentTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  usernameText: {
    fontWeight: 'bold',
    color: '#333',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    marginTop: 20,
  },
  buyButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 5,
    width: '48%',
  },
  addToCartButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    width: '48%', 
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ProductDetail;
