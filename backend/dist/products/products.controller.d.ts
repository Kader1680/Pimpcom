import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(query: QueryProductDto): Promise<{
        items: import("./entities/product.entity").Product[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findAllAdmin(): Promise<import("./entities/product.entity").Product[]>;
    findBySlug(slug: string): Promise<import("./entities/product.entity").Product>;
    findOne(id: string): Promise<import("./entities/product.entity").Product>;
    create(dto: CreateProductDto): Promise<import("./entities/product.entity").Product>;
    update(id: string, dto: UpdateProductDto): Promise<import("./entities/product.entity").Product>;
    remove(id: string): Promise<void>;
}
