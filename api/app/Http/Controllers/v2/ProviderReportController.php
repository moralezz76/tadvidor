<?php

namespace App\Http\Controllers\v2;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProviderReportController extends Controller
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

    public function index()
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
