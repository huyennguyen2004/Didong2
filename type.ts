import { NavigatorScreenParams } from '@react-navigation/native';

export type Product = {
  id: number;
  name: string;
  price: string;
  image: any;
  attributes: { color: string; size: string };
  description: string;
  category: string;
};

export type RootStackParamList = {
    Home: undefined;
    ProductDetail: { productId: number };

};
