import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
export declare class ProductsService {
    private readonly productsRepo;
    constructor(productsRepo: Repository<Product>);
    create(dto: CreateProductDto): Promise<Product>;
    findAll(query: QueryProductDto): Promise<{
        items: Product[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findAllAdmin(): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    findBySlug(slug: string): Promise<Product>;
    update(id: string, dto: UpdateProductDto): Promise<Product>;
    remove(id: string): Promise<void>;
    decrementStock(id: string, quantity: number): Promise<void>;
}
