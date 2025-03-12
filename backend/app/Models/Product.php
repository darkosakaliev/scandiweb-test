<?php

namespace App\Models;

use App\Casts\Attribute;
use App\Models\Model;
use App\Relations\BelongsTo;
use App\Relations\HasMany;
use App\Models\Attribute as AttributeModel;

class Product extends Model
{
    /**
     * Table name
     */
    public $table = "products";

    /**
     * Fillable Attributes for mass assignment
     */
    protected $fillable = ["name", "in_stock", "description", "category_id"];

    /**
     * InStock Accessor
     */
    protected function inStock(): Attribute
    {
        return Attribute::make(get: fn() => $this->in_stock);
    }

    /**
     * Gallery Accessor
     */
    protected function gallery(): Attribute
    {
        return Attribute::make(
            get: fn(string $value) => json_decode($value, 1)
        );
    }

    /**
     * Relationships
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, "category_id");
    }

    public function prices(): HasMany
    {
        return $this->hasMany(Price::class, "product_id");
    }

    public function attrs(): HasMany
    {
        return $this->hasMany(AttributeModel::class, "product_id");
    }
}
