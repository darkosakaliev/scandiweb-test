<?php

namespace App\Relations;

class BelongsTo
{
    public string $table;

    public string $column;

    public string $model;

    public function __construct($model, $column)
    {
        $this->table = (new $model())->table;
        $this->column = $column;
        $this->model = $model;
    }
}
