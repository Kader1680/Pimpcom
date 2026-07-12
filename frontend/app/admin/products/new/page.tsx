import ProductForm from '@/components/ProductForm';

export default function NewProductPage() {
  return (
    <div className="container-page py-8">
      <div className="mb-8">
        <span className="label-eyebrow">Catalog</span>
        <h1 className="font-display text-3xl font-bold">New product</h1>
      </div>
      <ProductForm />
    </div>
  );
}
