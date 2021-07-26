<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Jsondata extends Model
{
    protected $fillable = [
        'name',
        'description',
        'from_time',
        'to_time',
        'refer',
        'data_file',
        'name_file',
        'owner_id',
    ];
}
