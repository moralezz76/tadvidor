<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Scatter extends Model
{
    protected $fillable = [
        'name',
        'description',
        'refer',
        'data_file',
        'name_file',
        'owner_id',
    ];
}
