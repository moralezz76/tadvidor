<?php

namespace App\Http\Controllers\v2;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use GuzzleHttp\Client;
use GuzzleHttp\RequestOptions;

class InternetIndexController extends Controller
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


    private function me_country(&$ret, $item, $idx)
    {
        /*if ($idx == 1) {
            return $ret[$item[1]] = $item[0];
        }
        $_idx = $idx == 2 ? 1 : ($idx == 1 ? 2 : $idx);
        if (!isset($ret[$item[$_idx]])) $ret[$item[$_idx]] = [];
        $ret = $this->me_country($ret[$item[$_idx]], $item, $idx - 1);
        return $ret;*/

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


    public function get_http_data($geoName)
    {

        $ret = [];
        $token = 'KTA=2021';
        $scopes = [
            'CustomerBase' => 'cc',
            'CustomerBaseType' => 'cc',
            'CustomerGrowth' => 'cc',
            'PeeringBase' => 'cc',
        ];

        //  curl --insecure -H "Authorization: Bearer KTA=2021" GET 'https://147.135.52.8:57115/dixan/ranks/cc/FR/retail
        foreach ($scopes as $name => $scope) {
            $url = "https://147.135.52.8:57115/dixan/ranks/$scope/$geoName/retail";
            $curlHandler = curl_init();

            curl_setopt_array($curlHandler, [

                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_SSL_VERIFYHOST => 0,
                CURLOPT_SSL_VERIFYPEER => 0,
                CURLOPT_HTTPHEADER => [
                    'Accept: application/json',
                    'Authorization: Bearer ' . $token
                ],
            ]);

            $response = curl_exec($curlHandler);
            curl_close($curlHandler);

            $json = json_decode($response, true);

            $max = 0;
            $ret[$name] = array_reduce($json['ranks'], function ($ret, $item) use (&$max) {
                $max = $max !== 0 ? $max : $item['score'];
                $percent =  intval(($item['score'] / $max) * 100);
                $asnName = exec("/data/tools/asninfo/asninfo.sh " . $item['asn']);
                $ret[] = [$item['rank'], $item['bookmark'], $item['growth'], $asnName, '' . $item['asn'], $percent];
                return $ret;
            });
        }
        return $ret;
    }

    /*public function get_http_data2($geoName)
    {

        $ret = [];
        $token = 'KTA=2021';
        $scopes = [
            'CustomerBase' => 'cc',
            'CustomerBaseType' => 'cc',
            'CustomerGrowth' => 'cc',
            'PeeringBase' => 'cc',
        ];

        foreach ($scopes as $name => $scope) {
            $url = "https://147.135.52.8:57115/dixan/ranks/$scope/$geoName/retail";
            $httpClient = new Client();
            $response = $httpClient->get(
                'https://httpbin.org/bearer',
                [
                    RequestOptions::HEADERS => [
                        'Accept' => 'application/json',
                        'Authorization' => 'Bearer ' . $token,
                    ]
                ]
            );
            $ret[$name] = $response->getBody()->getContents();
        }
        return $ret;
    }*/


    public function index(Request $request)
    {

        $COU = $request->filter_value;
        $COU = strlen($COU) > 2 ? 'FR' : strtoupper($COU);

        return  response()->json([
            'status' => 200,
            'data' => [
                //'get_http_data' => $this->get_http_data('FR'),
                'blocks' => $this->get_http_data($COU),
                /*'menu_markets' => [
                    'Global' => $this->menu_markets()
                ],*/
                'menu_rankings' => [
                    'AllRankings' => [
                        "CustomerBase" => [
                            "Retail" => "retail",
                            "Wholesale" => "wholesale",
                            "Backbone" => "backbone"
                        ],
                        "CustomerGrowth" => "customer_growth",
                        "PeeringBase" => "peering_base",
                    ]
                ],
                /*'blocks' => [
                    'CustomerBase' => [
                        [1, 0, -1, 'Level 3 Communications, Inc.', '3356', 100],
                        [2, 0, 0, 'Global Crossing', '3549', 90],
                        [3, 1, 0, 'NTT Communications', '2914', 80],
                        [4, 0, 1, 'Sprint', '1239', 70],
                        [5, 0, 0, 'TeliaNet Global Network', '1299', 70],
                        [6, -1, 0, 'Tinet SpA', '3257', 50],
                        [7, 0, 0, 'Cogent Communications', '174', 30],
                        [8, 0, 0, 'Tata Communications', '6453', 20],
                        [9, 0, 0, 'MCI Services', '701', 20],
                        [10, 0, 0, 'TELECON ITALIA', '6762', 10],
                        [11, 0, 0, 'TELECON ITALIA 2', '26762', 10],
                    ],
                    'CustomerBaseType' => [
                        [1, 0, 0, 'Level 3 Communications, Inc.', '3356', 100],
                        [2, 0, -1, 'Global Crossing', '3549', 90],
                        [3, 1, 0, 'NTT Communications', '2914', 80],
                        [4, 0, 1, 'Sprint', '1239', 70],
                        [5, 0, 0, 'TeliaNet Global Network', '1299', 70],
                        [6, -1, 0, 'Tinet SpA', '3257', 50],
                        [7, 0, 0, 'Cogent Communications', '174', 30],
                        [8, 0, -1, 'Tata Communications', '6453', 20],
                        [9, 0, 0, 'MCI Services', '701', 20],
                        [10, 0, 0, 'TELECON ITALIA', '6762', 10],
                    ],
                    'CustomerGrowth' => [
                        [1, 0, 0, 'Level 3 Communications, Inc.', '3356', 100],
                        [2, 0, -1, 'Global Crossing', '3549', 90],
                        [3, 1, 0, 'NTT Communications', '2914', 80],
                        [4, 0, 1, 'Sprint', '1239', 70],
                        [5, 0, 0, 'TeliaNet Global Network', '1299', 70],
                        [6, -1, 0, 'Tinet SpA', '3257', 50],
                        [7, 0, 0, 'Cogent Communications', '174', 30],
                        [8, 0, -1, 'Tata Communications', '6453', 20],
                        [9, 0, 0, 'MCI Services', '701', 20],
                        [10, 0, 0, 'TELECON ITALIA', '6762', 10],
                    ],
                    'PeeringBase' => [
                        [1, 0, 0, 'Level 3 Communications, Inc.', '3356', 100],
                        [2, 0, -1, 'Global Crossing', '3549', 90],
                        [3, 1, 0, 'NTT Communications', '2914', 80],
                        [4, 0, 1, 'Sprint', '1239', 70],
                        [5, 0, 0, 'TeliaNet Global Network', '1299', 70],
                        [6, -1, 0, 'Tinet SpA', '3257', 50],
                        [7, 0, 0, 'Cogent Communications', '174', 30],
                        [8, 0, -1, 'Tata Communications', '6453', 20],
                        [9, 0, 0, 'MCI Services', '701', 20],
                        [10, 0, 0, 'TELECON ITALIA', '6762', 10],
                    ]
                ]*/
            ],
        ], 200);
    }
}
