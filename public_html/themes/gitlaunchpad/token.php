<?php
// Step 6
$data = 'client_id=' . '83f5f156a493b0aec253' . '&' .
		'client_secret=' . '0ca9118aa8fa2b187815c283c7e8f0a43200d672' . '&' .
		'code=' . urlencode($_GET['code']);

$ch = curl_init('https://github.com/login/oauth/access_token');
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);

preg_match('/access_token=([0-9a-f]+)/', $response, $out);
echo $out[1];
curl_close($ch);
?>