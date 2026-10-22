module.exports = {
  order: 2,
  category: 'qr',
  icon: 'wifi',
  use: 'qr-code-generator',
  preset: 'wifi',
  name: 'Wi-Fi QR Code Generator',
  keywords: 'wifi qr code share wifi password guest wifi qr',
  short: 'Let guests join your Wi-Fi by scanning a code. No password typing.',
  title: 'Wi-Fi QR Code Generator: Share Your Wi-Fi Password Easily',
  description: 'Create a QR code that connects phones to your Wi-Fi in one scan. Works with iPhone and Android cameras. Print it for home, café, office or Airbnb. Free.',
  related: ['qr-code-generator', 'password-generator', 'qr-code-scanner'],
  answer: `Enter your network name (SSID) and password, choose the security type (almost always <strong>WPA/WPA2</strong>), and download the QR code. Guests point their phone camera at it and tap the notification to join, with no typing. It works with the built-in camera on iPhone (iOS 11 and later) and Android (10 and later).`,
  article: `
<h2>How a Wi-Fi QR code works</h2>
<p>The code contains your network details in a standard format that phones understand:</p>
<div class="formula">WIFI:T:WPA;S:Home WiFi;P:your-password;;</div>
<p>When a phone camera sees it, it offers to join the network. The password is stored in the code itself, so the code never expires and works without internet, which is exactly what you need when someone isn't connected yet.</p>

<h2>Where to use one</h2>
<ul>
<li><strong>Home:</strong> stick it on the fridge or by the router for visiting friends and family.</li>
<li><strong>Cafés, restaurants and shops:</strong> print it on table cards or the counter instead of writing the password on a board.</li>
<li><strong>Holiday rentals and Airbnb:</strong> put it in the welcome folder. Guests' number-one question answered.</li>
<li><strong>Offices and events:</strong> a guest network code on reception or conference badges.</li>
</ul>

<h2>Finding your network details</h2>
<ul>
<li><strong>Network name (SSID):</strong> the name you see in your phone's Wi-Fi list. It's case-sensitive.</li>
<li><strong>Password:</strong> often printed on a sticker on the router if you haven't changed it.</li>
<li><strong>Security:</strong> choose WPA/WPA2/WPA3 for nearly all modern routers. Only choose WEP for very old equipment, and "None" for open networks.</li>
<li><strong>Hidden network:</strong> tick this if your network doesn't appear in the Wi-Fi list.</li>
</ul>

<h2>Security tips</h2>
<ul>
<li>Anyone who can see the code can join your network, so for public places create a separate <strong>guest network</strong> on your router and use that.</li>
<li>If you change your Wi-Fi password, make and print a new code.</li>
<li>This generator runs in your browser: your password isn't sent to any server.</li>
</ul>

<h2>Printing</h2>
<p>Download the SVG for the sharpest print, or PNG at 1024 px. Make the code at least 3 cm wide and add a line of text like "Scan to join our Wi-Fi" so people know what it is.</p>`,
  faqs: [
    ['How do I share my Wi-Fi with a QR code?', 'Enter your network name and password, download the QR code and print it. Guests scan it with their phone camera to join.'],
    ['Do Wi-Fi QR codes work on iPhone?', 'Yes. The built-in Camera app on iOS 11 and later recognises Wi-Fi QR codes.'],
    ['Is a Wi-Fi QR code safe?', 'Anyone who scans it can join your network. Use a guest network for public places. Your password isn’t uploaded when you create the code here.'],
    ['Does a Wi-Fi QR code expire?', 'No. It works until you change your Wi-Fi name or password.'],
    ['What security type should I choose?', 'WPA/WPA2/WPA3 for almost all modern routers.'],
  ],
};
