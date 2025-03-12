<?php

namespace App\Models;

use App\Casts\Attribute;
use App\Models\Model;
use App\Relations\BelongsTo;

class Price extends Model
{
    /**
     * Table name
     */
    public $table = "prices";

    /**
     * Fillable Attributes for mass assignment
     */
    protected $fillable = ["amount", "currency", "product_id"];

    /**
     * Relationships
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, "product_id");
    }

    /**
     * Currency Accessor
     */
    protected function currency(): Attribute
    {
        return Attribute::make(
            get: fn() => [
                "label" => $this->currency_label ?: "USD",
                "symbol" => $this->currency_symbol ?: "$",
            ]
        );
    }
}
