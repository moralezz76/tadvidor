<?php

namespace App\Http\Controllers\v2;

use App\Asnfav;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
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

        $asnList = [];
        foreach ($array_result as $asn1) {

            $name = exec("/data/tools/asninfo/asninfo.sh " . substr($asn1, 2));
            $pt = [$asn1, $name];
            $asnList[] = $pt;
        }

        /*$array_result = [
            [
                "AS3491",
                "AS23313 ASN-HIG, BM"
            ],
            [
                "AS567451",
                "AS567451 KALNET4U t/a Tamar Telecommunications, GB"
            ],
            [
                "AS567781",
                "AS567781 PURETELECOM-IE-NET, IE"
            ],
            [
                "AS34911",
                "AS34911  BTN-ASN, US"
            ]
        ];*/

        return  response()->json([
            'status' => 200,
            'data' => [
                //'asnList1' => $array_result,
                'asnList' => $asnList
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
                /*'menu_markets' => [
                    'Global' => $this->menu_markets()
                ],*/

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
                'profileData' => [
                    'name' => exec("/data/tools/asninfo/asninfo.sh $asn"),
                ],
                'IPv4AsCustomers' => [

                    [
                        1, 0,
                        "6233",
                        "AS6233  XTOM, US", 343, '15 nov 2014', 100
                    ],
                    [
                        2, 1,
                        "6894",
                        "AS6894  KDDI-EUROPE KDDI Europe Ltd., GB", 124, '15 nov 2014', 99
                    ],
                    [
                        3, 0,
                        "14840",
                        "AS14840 BR.Digital Provider, BR", 5332, '15 nov 2014', 90
                    ],
                    [
                        4, 0,
                        "15830",
                        "AS15830 EQUINIX-CONNECT, GB", 2322, '15 nov 2014', 90
                    ],
                    [
                        5, 0,
                        "20562",
                        "AS20562 OPEN-PEERING-AS Open Peering Initiative, Amsterdam, The Netherlands, NL", 3223, '15 nov 2014', 100
                    ],
                    [
                        6, 0,
                        "24482",
                        "AS24482 SGGS-AS-AP SG.GS, SG", 2322, '15 nov 2014', 85
                    ],
                    [
                        7, 0,
                        "25091",
                        "AS25091 IP-MAX, CH", 324, '15 nov 2014', 81
                    ],
                    [
                        8, 0,
                        "25160",
                        "AS25160 VORBOSS_AS, GB", 34343, '15 nov 2014', 55
                    ],
                    [
                        9, 0,
                        "28792",
                        "AS28792 PUBLIC-INTERNET, GB", 2233, '15 nov 2014', 55
                    ],
                    [
                        10, 0,
                        "31019",
                        "AS31019 MEANIE Meanie Heavy Industries, NL", 4343, '15 nov 2014', 10
                    ],
                ],
                //'$shell_str' => $shell_str,
                /*'menu_markets' => [
                    'Global' => $this->menu_markets()
                ],*/

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
                /*'menu_markets' => [
                    'Global' => $this->menu_markets()
                ],*/
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
