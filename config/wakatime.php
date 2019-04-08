<?php

return [
    'api_key' => env('WAKATIME_API_KEY'),

    // 查询结果缓存时长
    'cache_seconds' => env('WAKATIME_CACHE_SECONDS', 120),
];