<?php

namespace App\Http\Controllers\v2;

use App\Http\Controllers\Controller;
use App\Jsondata;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class OptionsController extends Controller
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



    public function data($table)
    {
        return  response()->json([
            'status' => 200,
            'data' => []
        ], 200);
    }


    public function viz(Request $request)
    {


        $app_data = config('app.data'); // read data folder
        $d = dir($app_data);
        $ret = [];
        $runscan_data = config('app.runscan');

        // queue list first
        $queue_list = is_file("{$runscan_data}/.queue") ? file_get_contents("{$runscan_data}/.queue") : '';
        $queues = explode("\n", $queue_list);
        foreach ($queues as $queue) {
            if ($queue !== '') {
                list($entry, $owner) = explode(' ', $queue);
                list(,, $unixfrom, $unixto) = explode('_', $entry);

                $this->add_result(
                    $request,
                    $ret,
                    [
                        $entry,
                        2,
                        $unixfrom,
                        $unixto,
                        0,
                        0,
                        $owner
                    ]
                );
            }
        }

        while (false !== ($entry = $d->read())) {
            $fullPath = "$app_data/$entry";
            if (is_dir($fullPath) && $entry !== '.' && $entry !== '..') {
                $pt = explode('_', $entry);
                if (count($pt) === 4) {
                    list(,, $unixfrom, $unixto) = $pt;
                    $status = 0;
                    $tprocess = 0;
                    if (is_file("{$fullPath}/.start") && is_file("{$fullPath}/.end")) {
                        $status = 1;
                        $tprocess = stat("{$fullPath}/.end")['ctime'] - stat("{$fullPath}/.start")['ctime'];
                    }
                    $owner = is_file("{$fullPath}/.owner") ? file_get_contents("{$fullPath}/.owner") : '';

                    $this->add_result(
                        $request,
                        $ret,
                        [
                            $entry,
                            $status,
                            $unixfrom,
                            $unixto,
                            time() - stat($fullPath)['ctime'],
                            $tprocess,
                            $owner
                        ]
                    );
                }
            }
        }
        $d->close();
        usort($ret, function ($a, $b) {
            return $a[4] > $b[4];
        });

        return  response()->json(
            [
                'status' => 200,
                'data' => [
                    'options' => $ret,
                ]
            ],
            200
        );
    }

    private function add_result($request, &$ret,  $add)
    {
        list($entry) = $add;
        $folder =  $request['folder'] ? $request['folder'] : '';
        $folder_ok = $folder === '' || strpos($entry, $folder, 0) !== false;
        //$add[0] = "$folder_ok - $folder - $entry";
        $folder_ok &&
            $ret[] = $add;
    }
}
