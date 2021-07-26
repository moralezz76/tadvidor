<?php

namespace App\Http\Controllers\v2;

use App\Http\Controllers\Controller;
use App\Jsondata;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class JsondataController extends Controller
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
     * Remove the specified resource from storage.
     *
     * @param  \App\Scatter  $scatter
     * @return \Illuminate\Http\Response
     */
    public function destroy(Jsondata $jsondata)
    {
        $jsondata->delete();
        return  response()->json([
            'status' => 200,
        ], 200);
    }

    public function download(Jsondata $jsondata)
    {

        $file = $this->base64_decode_file(Storage::disk('public')->get($jsondata->data_file));

        return  response()->json([
            'status' => 200,
            'data' => [
                'content' => Storage::disk('public')->get($jsondata->data_file),
                'filename' => $jsondata['name_file']
            ]
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Scatter  $scatter
     * @return \Illuminate\Http\Response
     */
    public function json(Jsondata $jsondata)
    {


        $file = $this->base64_decode_file(Storage::disk('public')->get($jsondata->data_file));
        return  response()->json([
            'status' => 200,
            'data' => $file['data'],
        ], 200);
    }


    // list all JSON data
    public function list()
    {
        $data = Jsondata::orderBy('id', 'desc')->get()->toArray();
        return  response()->json([
            'status' => 200,
            'data' => $data,
        ], 200);
    }

    // return JSON data from storage
    public function json_old($refer)
    {
        $data = Jsondata::where('refer', $refer)->first();
        $file = $this->base64_decode_file(Storage::disk('public')->get($data->data_file));
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
                'data' => json_decode(base64_decode($matches[2])),
            ];
        }
        return false;
    }

    public function add(Request $request)
    {

        $requestData = $request->all();


        $data_file = Str::random(40);
        Storage::disk('public')->put($data_file, $requestData['jsonFile']['file']);

        Jsondata::create([
            'name' => $requestData['prefix'],
            'description' => $requestData['description'],
            'from_time' => $requestData['fromTime'],
            'to_time' => $requestData['toTime'],
            'refer' =>  str_replace('/', '_', $requestData['prefix']) . '_' . $requestData['fromTime'] . '_' . $requestData['fromTime'],
            'name_file' => $requestData['jsonFile']['filename'],
            'data_file' => $data_file,
            'owner_id' => Auth::id()
        ]);

        return  response()->json([
            'status' => 200,
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Jsondata  $jsondata
     * @return \Illuminate\Http\Response
     */
    public function edit(Jsondata $jsondata, Request $request)
    {

        $jsondata->description = $request['description'];
        $jsondata->update();
        return  response()->json([
            'status' => 200,
            //    'data' => $request['description'],
        ], 200);
    }
}
