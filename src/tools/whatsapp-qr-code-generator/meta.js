module.exports = {
  order: 3,
  category: 'qr',
  icon: 'message-circle',
  use: 'qr-code-generator',
  preset: 'wa',
  name: 'WhatsApp QR Code Generator',
  keywords: 'whatsapp qr code chat link wa.me qr business whatsapp',
  short: 'A QR code that opens a WhatsApp chat with you, with a ready-typed message.',
  title: 'WhatsApp QR Code Generator: Start a Chat With One Scan',
  description: 'Create a QR code that opens a WhatsApp chat with your number, with an optional pre-filled message. Great for shops, menus, flyers and business cards. Free.',
  related: ['qr-code-generator', 'vcard-qr-code-generator', 'bulk-qr-code-generator'],
  answer: `Enter your WhatsApp number <strong>with the country code</strong> (for example +44 7700 900123) and an optional message, then download the code. Anyone who scans it lands in a WhatsApp chat with you, with the message already typed, so customers can reach you without saving your number first.`,
  article: `
<h2>How it works</h2>
<p>WhatsApp supports "click to chat" links in the form <code>https://wa.me/447700900123?text=Hello</code>. The QR code contains that link. Scanning it opens WhatsApp (or WhatsApp Business) on the phone, starts a chat with your number and fills in the message. The customer just presses send.</p>

<h2>Getting the number right</h2>
<ul>
<li>Include the <strong>country code</strong>: 44 for the UK, 1 for the US and Canada, 91 for India, 92 for Pakistan, 971 for the UAE, and so on.</li>
<li>Leave out the leading zero of local numbers: UK 07700 900123 becomes +44 7700 900123.</li>
<li>Spaces, dashes and brackets are removed automatically.</li>
<li>Test the code with your own phone before printing.</li>
</ul>

<h2>Ideas for the pre-filled message</h2>
<ul>
<li>Restaurants: "Hi, I'd like to book a table for…"</li>
<li>Shops: "Hi, I saw your flyer and I'm interested in…"</li>
<li>Property: "Hello, I'm interested in the flat on King Street."</li>
<li>Events: "Please add me to the event updates."</li>
</ul>
<p>A specific message tells you where the customer found you, which helps you measure which flyers and posters work. Keep it short and friendly; the customer can still edit it before sending.</p>

<h2>Where to put it</h2>
<p>Shop windows, product packaging, menus, business cards, delivery bags, property boards, posters and the back of receipts. Add a short line like "Chat with us on WhatsApp" next to the code so people know what to expect.</p>

<h2>Privacy</h2>
<p>The code works without any third-party service: it's a direct WhatsApp link, so it never expires and no one tracks the scans. Your number is processed only in your browser while you make the code.</p>`,
  faqs: [
    ['How do I make a WhatsApp QR code?', 'Enter your WhatsApp number with the country code, add an optional message, and download the QR code.'],
    ['Does it work with WhatsApp Business?', 'Yes. The same link format opens chats with WhatsApp Business numbers.'],
    ['Why does the QR code open the wrong number?', 'Check the country code and remove the leading zero of your local number.'],
    ['Does a WhatsApp QR code expire?', 'No. It is a static link that works as long as your number uses WhatsApp.'],
    ['Can I change the message later?', 'The message is part of the code, so make a new code to change it.'],
  ],
};
