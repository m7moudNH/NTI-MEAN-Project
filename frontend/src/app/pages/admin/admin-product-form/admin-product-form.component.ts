import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product, ProductCategory, ProductGender, ProductSize } from '../../../core/models/product.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-product-form.component.html',
  styleUrl: './admin-product-form.component.css',
})
export class AdminProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  isEdit = false;
  productId: string | null = null;
  loading = false;
  saving = false;
  errorMessage = '';
  selectedFile: File | null = null;
  existingImageUrl = '';

  categories: ProductCategory[] = ['t-shirt', 'hoodie', 'pants', 'shorts', 'jacket', 'shoes', 'accessories'];
  genders: ProductGender[] = ['men', 'women'];
  sizes: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(1000)]],
    price: [0, [Validators.required, Validators.min(0)]],
    category: ['t-shirt' as ProductCategory, Validators.required],
    brand: ['', Validators.required],
    gender: ['' as ProductGender | '', []],
    size: [[] as string[]],
    colors: [''],
    stock: [0, [Validators.required, Validators.min(0)]],
    discount: [0, [Validators.min(0), Validators.max(100)]],
    isFeatured: [false],
  });

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.productId;
    if (this.productId) {
      this.loading = true;
      this.productService.getById(this.productId).subscribe({
        next: (res) => {
          const p = res.data.product;
          this.existingImageUrl = p.imageUrl || '';
          this.form.patchValue({
            title: p.title,
            description: p.description,
            price: p.price,
            category: p.category,
            brand: p.brand,
            gender: p.gender || '',
            size: p.size || [],
            colors: (p.colors || []).join(', '),
            stock: p.stock,
            discount: p.discount,
            isFeatured: p.isFeatured,
          });
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Could not load product.';
          this.loading = false;
        },
      });
    }
  }

  get imagePreview(): string {
    return this.existingImageUrl ? `${environment.apiOrigin}/uploads/products/${this.existingImageUrl}` : '';
  }

  toggleSize(size: ProductSize) {
    const current = this.form.value.size || [];
    this.form.patchValue({
      size: current.includes(size) ? current.filter((s) => s !== size) : [...current, size],
    });
  }

  isSizeSelected(size: ProductSize): boolean {
    return (this.form.value.size || []).includes(size);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.errorMessage = '';
    const raw = this.form.getRawValue();
    const payload = {
      title: raw.title!,
      description: raw.description!,
      price: raw.price!,
      category: raw.category!,
      brand: raw.brand!,
      gender: raw.gender || undefined,
      size: (raw.size ?? []) as ProductSize[],
      colors: raw.colors ? raw.colors.split(',').map((c) => c.trim()).filter(Boolean) : [],
      stock: raw.stock!,
      discount: raw.discount ?? 0,
      isFeatured: raw.isFeatured ?? false,
    } satisfies Partial<Product>;

    const request = this.isEdit
      ? this.productService.update(this.productId!, payload, this.selectedFile || undefined)
      : this.productService.create(payload, this.selectedFile || undefined);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigateByUrl('/admin/products');
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err.error?.message || 'Could not save product.';
      },
    });
  }
}
