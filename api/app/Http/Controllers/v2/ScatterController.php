<?php

namespace App\Http\Controllers\v2;

use App\Http\Controllers\Controller;
use App\Scatter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class ScatterController extends Controller
{

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth.user');
    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = Scatter::orderBy('id', 'desc')->get()->toArray();
        return  response()->json([
            'status' => 200,
            'data' => $data,
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $requestData = $request->all();


        $data_file = Str::random(40);
        Storage::disk('public')->put($data_file, $requestData['scatterFile']['file']);

        Scatter::create([
            'name' => $data_file,
            'description' => $requestData['description'],
            'refer' => $data_file,
            'name_file' => $requestData['scatterFile']['filename'],
            'data_file' => $data_file,
            'owner_id' => Auth::id()
        ]);

        return  response()->json([
            'status' => 200,
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Scatter  $scatter
     * @return \Illuminate\Http\Response
     */
    public function show(Scatter $scatter)
    {


        $file = $this->base64_decode_file(Storage::disk('public')->get($scatter->data_file));
        return  response()->json([
            'status' => 200,
            'data' => $file['data'],
        ], 200);
    }


    function base64_decode_file($data)
    {
        if (preg_match('/^data\:([a-zA-Z]+\/[a-zA-Z]+);base64\,([a-zA-Z0-9\+\/]+\=*)$/', $data, $matches)) {
            return [
                'mime' => $matches[1],
                'data' => base64_decode($matches[2]),
            ];
        }
        return false;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Scatter  $scatter
     * @return \Illuminate\Http\Response
     */
    public function edit(Scatter $scatter)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Scatter  $scatter
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Scatter $scatter)
    {

        $scatter->description = $request['description'];
        $scatter->update();
        return  response()->json([
            'status' => 200,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Scatter  $scatter
     * @return \Illuminate\Http\Response
     */
    public function destroy(Scatter $scatter)
    {
        $scatter->delete();
        return  response()->json([
            'status' => 200,
        ], 200);
    }

    public function download(Scatter $scatter)
    {

        $file = $this->base64_decode_file(Storage::disk('public')->get($scatter->data_file));

        return  response()->json([
            'status' => 200,
            'data' => [
                'content' => Storage::disk('public')->get($scatter->data_file),
                'filename' => $scatter['name_file']
            ]
        ], 200);
    }
}
