import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Product = {
  id: number;
  title: string; 
  price: number; 
  image: string; 
};

const Cart = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [selectedProducts, setSelectedProducts] = useState<{ [key: number]: boolean }>({});

  const handleIncrease = (id: number) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 1) + 1 }));
  };

  const handleDecrease = (id: number) => {
    setQuantities((prev) => {
      if (prev[id] > 1) {
        return { ...prev, [id]: prev[id] - 1 };
      }
      return prev;
    });
  };

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartData = await AsyncStorage.getItem('cart');
        if (cartData) {
          const storedCart: Product[] = JSON.parse(cartData);
          setProducts(storedCart);
          setQuantities(storedCart.reduce((acc, product) => {
            acc[product.id] = 1;
            return acc;
          }, {} as { [key: number]: number }));
        }
      } catch (error) {
        console.error('Error loading cart data:', error);
      }
    };

    loadCart();
  }, []);

  const handleRemove = (id: number) => {
    Alert.alert("Remove Item", "Are you sure you want to remove this item from the cart?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Remove", 
        onPress: async () => {
          const updatedProducts = products.filter(product => product.id !== id);
          setProducts(updatedProducts);
          
          try {
            await AsyncStorage.setItem('cart', JSON.stringify(updatedProducts));
            console.log("Product removed and storage updated");
          } catch (error) {
            console.error("Error updating storage:", error);
          }
        }
      }
    ]);
  };

  const handleCheckboxChange = (id: number, newValue: boolean) => {
    setSelectedProducts((prev) => ({ ...prev, [id]: newValue }));
  };

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      if (selectedProducts[product.id]) {
        return total + (product.price * (quantities[product.id] || 1));
      }
      return total;
    }, 0);
  };

  const resetCart = async () => {
    try {
      await AsyncStorage.removeItem('cart');
      setProducts([]); 
      setQuantities({});
      console.log("Cart reset successfully");
    } catch (error) {
      console.error("Error resetting cart:", error);
    }
  };
  

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <TouchableOpacity onPress={() => handleCheckboxChange(item.id, !selectedProducts[item.id])}>
        <Text style={styles.check}>{selectedProducts[item.id] ? '☑' : '☐'}</Text>
      </TouchableOpacity>
      <Image 
        source={{ uri: item.image }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{item.title}</Text>
          <TouchableOpacity onPress={() => handleRemove(item.id)}>
            <Text style={styles.removeButton}>X</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.productPrice}>{item.price} đ</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => handleDecrease(item.id)} style={styles.quantityButton}>
            <Text style={styles.quantityText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantities[item.id] || 1}</Text>
          <TouchableOpacity onPress={() => handleIncrease(item.id)} style={styles.quantityButton}>
            <Text style={styles.quantityText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping Cart
      <TouchableOpacity onPress={resetCart} style={styles.orderButton}>
  <Text style={styles.orderButtonText}>Reset Cart</Text>
</TouchableOpacity>
      </Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProductItem}
        contentContainerStyle={styles.container}
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: {calculateTotal()} đ</Text>
        <TouchableOpacity style={styles.orderButton}>
          <Text style={styles.orderButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
  
    </View>

  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  check: {
    fontSize: 16,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    backgroundColor: '#f5a623',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    textAlign: 'left', 
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    color: 'red',
    fontSize: 16,
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#ddd',
    borderRadius: 4,
    padding: 5,
    marginHorizontal: 5,
  },
  quantityText: {
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderButton: {
    backgroundColor: '#ff6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Cart;
