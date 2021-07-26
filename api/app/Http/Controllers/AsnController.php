<?php

namespace App\Http\Controllers;

use App\Asnfav;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;


class AsnController extends Controller
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
    public function index(Request $reques)
    {

        $array_result = [];
        $asn = $reques['asnName'];
        $shell_str = "cat /data/caida/20210301.as-rel.txt | fgrep $asn | awk -F\"|\" '{ if (index($2, $asn)==1) { print \"AS\"$2 }}' | head -100";
        exec($shell_str, $array_result);

        //$array_result = ["AS7694", 'AS' . rand(1000, 99999)];

        return  response()->json([
            'status' => 200,
            'data' => [
                'profileData' => array_keys(array_flip($array_result))
            ]

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
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\AsnFav  $asnfav
     * @return \Illuminate\Http\Response
     */
    public function profile(Request $request) // menu profile
    {

        /*
        -1 significa 174 es el "transit provider" de 1265
        0 significa 174 es un "peer" de 1273
        */

        $peer = [];
        $tprovider = [];
        $client = [];
        $asn = substr($request['id_asn'], 2);

        $shell_str = "cat /data/caida/20210301.as-rel.txt | fgrep $asn | awk -F\"|\" '{if ($2 == $asn) { print $1,$2,$3 } else if ($1 == $asn) { print $2,$1,1 }} ' ";
        exec($shell_str, $array_result);

        foreach ($array_result as $res) {
            list($asn1, $asn2, $type) = explode(" ", $res);
            $pt = [$asn1, exec("/data/tools/asninfo/asninfo.sh $asn1")];
            if ($type === '1') $client[] = $pt;
            if ($type === '0') $peer[] = $pt;
            if ($type === '-1') $tprovider[] = $pt;
        }


        return  response()->json([
            'status' => 200,
            'data' => [

                'profileData' => [
                    'name' => exec("/data/tools/asninfo/asninfo.sh $asn"),
                    'tproviders' => $tprovider,
                    'peers' => $peer,
                    'clients' => $client,
                ],
                //'$shell_str' => $shell_str,
                'menu_markets' => [
                    'Global' => $this->menu_markets()
                ],

            ],

        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\AsnFav  $asnfav
     * @return \Illuminate\Http\Response
     */
    public function as_customers(Request $request) // menu as_customers
    {

        /*
        -1 significa 174 es el "transit provider" de 1265
        0 significa 174 es un "peer" de 1273
        */


        $asn = substr($request['id_asn'], 2);

        return  response()->json([
            'status' => 200,
            'data' => [
                //'name' => exec("/data/tools/asninfo/asninfo.sh $asn"),
                'IPv4AsCustomers' => [
                    [1, 0, 'Rostelecon', '12387', 6, '15 nov 2014', 100],
                    [2, 0, 'Rostelecon', '12387', 6, '23 nov 2014', 50],
                    [3, 0, 'Rostelecon', '12387', 6, '34 nov 2014', 25],
                    [4, 0, 'Rostelecon', '12387', 6, '25 nov 2014', 12],
                    [5, 0, 'Rostelecon', '12387', 6, '22 nov 2014', 6],
                    [6, 0, 'Rostelecon', '12387', 6, '11 nov 2014', 3],
                ],
                //'$shell_str' => $shell_str,
                'menu_markets' => [
                    'Global' => $this->menu_markets()
                ],

            ],

        ], 200);
    }


    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\AsnFav  $asnfav
     * @return \Illuminate\Http\Response
     */
    public function edit(AsnFav $asnfav)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\AsnFav  $asnfav
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, AsnFav $asnfav)
    {
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\AsnFav  $asnfav
     * @return \Illuminate\Http\Response
     */
    public function destroy(AsnFav $asnfav)
    {
    }

    /**/

    private function me_country(&$ret, $item, $idx)
    {
        if ($idx == 1) {
            $ret[$item[1]] = $item[0];
            return;
        }
        $this->me_country($ret[$item[$idx]], $item, $idx - 1);
    }


    private function menu_markets()
    {
        $ret = [];
        $file = Storage::disk('local')->get('csv/country_menu.csv');
        $records = explode("\n", $file);
        for ($t = 0; $t < count($records); ++$t) {
            $item = explode(',', $records[$t]);
            if (count($item) == 4) {
                $this->me_country($ret, [$item[0], $item[1], $item[3], $item[2]], 3);
            } elseif (count($item) == 3) {
                $this->me_country($ret, [$item[0],  $item[1], '', $item[2]], 3);
            }
        }
        return $ret;
    }



    public function index1()
    {


        return  response()->json([
            'status' => 200,
            'data' => [
                'menu_markets' => [
                    'Global' => $this->menu_markets()
                ],
                'profileData' => [],
                'IPv4AsCustomers' => [
                    [1, 0, 0, 'Level 3 Communications, Inc.', '3356', 100],
                    [2, 0, 0, 'Global Crossing', '3549', 90],
                    [3, 1, 0, 'NTT Communications', '2914', 80],
                    [4, 0, 1, 'Sprint', '1239', 70],
                    [5, 0, 0, 'TeliaNet Global Network', '1299', 70],
                    [6, -1, 0, 'Tinet SpA', '3257', 50],
                    [7, 0, 0, 'Cogent Communications', '174', 30],
                    [8, 0, 0, 'Tata Communications', '6453', 20],
                    [9, 0, 0, 'MCI Services', '701', 20],
                    [10, 0, 0, 'TELECON ITALIA', '6762', 10],
                ]
            ],
        ], 200);
    }
}
