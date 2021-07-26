<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Bootstrap\HandleExceptions;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Report or log an exception.
     *
     * @param  \Throwable  $exception
     * @return void
     *
     * @throws \Exception
     */
    public function report(Throwable $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @throws \Throwable
     */
    public function render($request, Throwable $exception)
    {

        if ($exception instanceof QueryException) {
            return response()->json([
                'status' => 406,
                'message' => 'Query exception!',
                'description' => $exception->getMessage()
            ], 406);
        }

        if ($exception instanceof JWTException) {
            return response()->json([
                'status' => 506,
                'message' => 'Session expired!',
            ], 506);
        }

        if ($exception instanceof HandleExceptions) {
            return response()->json([
                'status' => 407,
                'message' => 'File handle exception!',
                'description' => $exception->getMessage()
            ], 407);
        }

        return parent::render($request, $exception);
    }
}
