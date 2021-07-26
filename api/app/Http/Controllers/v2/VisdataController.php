<?php

namespace App\Http\Controllers\v2;

use App\Http\Controllers\Controller;
use App\Jsondata;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class VisdataController extends Controller
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


    // return JSON data from storage
    public function refer($refer)
    {

        list($ipv4, $param, $unixfrom, $unixto) = explode('_', $refer);

        $app_data = config('app.data'); // read data folder
        if (is_dir($app_data . $refer)) {

            $work_path = $app_data . "{$refer}/"; // reference to json
            if (is_file($work_path . ".end")) { // json complete, return info

                if (!is_file($work_path . ".json")) { // json complete, return info
                    $app_tools = config('app.tools'); // read tools folder
                    $shell_str = "{$app_tools}/bgpscan/walker_bgpdump.py $refer";
                    $ret = exec($shell_str);
                }

                return  response()->json([
                    'status' => 200,
                    'step' => 0,
                    'data' => json_decode(file_get_contents($work_path . ".json"))
                ], 200);
            } else { // json dont exist, continue waiting...
                return  response()->json([
                    'status' => 200,
                    'step' => 2,
                    'data' => [
                        'time' => time(),
                        'ctime' => stat($app_data . $refer)['ctime'],
                        'rib' => is_file($app_data . $refer . "/$refer.rib"),
                        'update' => is_file($app_data . $refer . "/$refer.updates"),
                    ]
                ], 200);
            }
        } else { // missing folder, call shell
            $this->call_bgpscan($refer);
            return  response()->json([
                'status' => 200,
                'step' => 3,
                'data' => $app_data . $refer
            ], 200);
        }
    }

    function call_bgpscan($refer)
    {
        $user = auth()->user();
        $name = $user->name;
        #list($ipv4, $param, $unixfrom, $unixto) = explode('_', $refer);
        #$ip = "{$ipv4}/{$param}";
        $app_tools = config('app.tools'); // read tools folder
        #$shell_str = "{$app_tools}/bgpscan/bgpscan.sh $ip $unixfrom $unixto >/dev/null 2>&1 &";
        $shell_str = "{$app_tools}/runscan/runscan.sh $refer $name >/dev/null &";
        $ret = exec($shell_str);
    }

    public function delete(Request $request, $folder)

    {

        $status = $request->status;
        switch ($status) {
            case 2:
                $app_tools = config('app.tools'); // read tools folder
                $shell_str = "{$app_tools}/runscan/runscan.sh -remove $folder >/dev/null &";
                $ret = exec($shell_str);
                break;

            default:
                $app_data = config('app.data'); // read data folder
                $this->delTree("{$app_data}$folder");
        }

        return  response()->json(
            [
                'status' => 200,
                'data' => [
                    'folder' => $folder,
                    'status' =>  $status
                ]
            ],
            200
        );
    }

    public function rerun($refer)
    {

        $app_data = config('app.data'); // read data folder
        $this->delTree("{$app_data}$refer");
        $this->call_bgpscan($refer);
        return  response()->json(
            [
                'status' => 200,
                'data' => $refer
            ],
            200
        );
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

    function delTree($dir)
    {
        $files = array_diff(scandir($dir), array('.', '..'));
        foreach ($files as $file) {
            (is_dir("$dir/$file")) ? $this->delTree("$dir/$file") : unlink("$dir/$file");
        }
        return rmdir($dir);
    }
}
