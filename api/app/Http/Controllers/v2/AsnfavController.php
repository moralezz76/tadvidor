<?php

namespace App\Http\Controllers\v2;

use App\Asnfav;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class AsnfavController extends Controller
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
        $asn_list = [];
        $asnfav = Asnfav::where('owner_id', Auth::id())->get();

        foreach ($asnfav as $item) {
            $asn_list[] = [$item->idasn, $item->description];
        }

        return  response()->json([
            'status' => 200,
            'data' => ['asnfav' => $asn_list]
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
        $asnFav = new AsnFav;
        $asnFav->idasn = $request->id;
        $asnFav->description = exec("/data/tools/asninfo/asninfo.sh " .  substr($request->id, 2));
        $asnFav->owner_id = Auth::id();
        $asnFav->save();

        return  $this->index();
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Asnfav  $asnfav
     * @return \Illuminate\Http\Response
     */
    public function show(Asnfav $asnfav)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Asnfav  $asnfav
     * @return \Illuminate\Http\Response
     */
    public function edit(Asnfav $asnfav)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Asnfav  $asnfav
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Asnfav $asnfav)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($asnfav)
    {

        $idasn = substr($asnfav, 2);
        $asnfav = Asnfav::where(['owner_id' => Auth::id(), 'idasn' => $asnfav])->delete();
        return  $this->index();
    }
}
