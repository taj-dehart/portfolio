<?php

$sender = 'greenvisionmedia.net';
$referrer = $_SERVER['HTTP_REFERER'];
$timestamp = date('Y-m-d H:i:s');

// Build and run time for globalists
function getTime()
{
    $timezone_cest = 'Europe/Paris';
    date_default_timezone_set($timezone_cest);
    $timestamp_cest = date('Y-m-d H:i:s');

    $timezone_mt = 'America/Denver';
    date_default_timezone_set($timezone_mt);
    $timestamp_mt = date('h:i A');

    $time = $timestamp_cest . ' CEST or about ' . $timestamp_mt . ' in Boulder.';
    return $time;
}

$time = getTime();

// Reject honeypot filled submissions
$hp_name = $_POST['name'];
$hp_email = $_POST['email'];
$is_spammer = false;

if (!empty($hp_name) || !empty($req[$hp_email])) {
    $is_spammer = true;
}

// Set safe state or redirect
if ($_SERVER['REQUEST_METHOD'] === 'POST' && strpos($referrer, $sender) !== false && !$is_spammer) {

    // Sanitize text fields and validate email
    foreach ($_POST as $key => $value) {
        if (strpos($key, '[]') === false) {
            $_POST[$key] = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
        }
    }

    if (isset($_POST['emobbail']) && $_POST['emobbail'] !== '') {

        $dirty_email = $_POST['emobbail'];
        $email = filter_var($dirty_email, FILTER_SANITIZE_EMAIL);

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            unset($email);
        }
    }

    // Email vars
    $name = $_POST['nobbame'];
    $message = $_POST['message'];
    $from = 'info@greenvision.media';
    $to = 'tajdehart@gmail.com';
    $subject = "Portfolio lead!";
    $headers = "From: Taj's Portfolio Website <" . $from . ">\r\n";
    $headers .= "Reply-To: " . $from . "\r\n";
    $headers .= "CC: " . $cc . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    $email_message = "Also spake the website at $time\n";
    $email_message .= "Here is what we got:\n";
    $email_message .= "      Email: $email\n";
    $email_message .= "      Name: $name\n";
    $email_message .= "      Message: $message\n";
    $email_message .= "\n\n";

    mail($to, $subject, $email_message, $headers);

} else {
    exit;
}

exit;
