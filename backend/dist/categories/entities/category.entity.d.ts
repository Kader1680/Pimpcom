import { Product } from '../../products/entities/product.entity';
export declare class Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    products: Product[];
    createdAt: Date;
    updatedAt: Date;
}
