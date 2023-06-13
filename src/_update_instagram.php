<?php 
$token = file_get_contents(__DIR__ . '/../instagram.token');
if (isset($_GET['refreshtoken'])) {
  $result = file_get_contents('https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=' . $token);// + vyextrahovani noveho tokenu
  $obj = json_decode($result);
  file_put_contents(__DIR__ . '/../instagram.token', $obj->{'access_token'});
  exit;
}
//$result = file_get_contents('https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=' . $token);
//$obj = json_decode($result);
$fields = 'id,media_type,media_url,thumbnail_url,timestamp,permalink,caption';
file_put_contents('instagram.json', file_get_contents('https://graph.instagram.com/me/media?fields=' . $fields . '&access_token=' . $token . '&limit=8'));