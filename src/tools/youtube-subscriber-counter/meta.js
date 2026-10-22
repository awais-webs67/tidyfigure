module.exports = {
  order: 1,
  category: 'social',
  icon: 'youtube',
  popular: true,
  name: 'YouTube Subscriber Counter',
  keywords: 'live subscriber count youtube sub count realtime channel subscribers',
  short: 'Live YouTube subscriber count for any channel, updated every minute.',
  title: 'Live YouTube Subscriber Count for Any Channel',
  description: 'See any YouTube channel’s subscriber count, total views and video count, refreshed every 60 seconds. Search by @handle, channel link or ID. Free and simple.',
  related: ['youtube-thumbnail-downloader', 'giveaway-picker', 'character-counter'],
  answer: `Type a channel's <strong>@handle</strong> (like @MrBeast), paste its link, or enter its channel ID, and the counter shows the subscriber count with total views and videos, refreshing every 60 seconds. The numbers come straight from the official YouTube Data API, which <strong>rounds</strong> public subscriber counts, so this is the same figure YouTube itself shows.`,
  article: `
<h2>How the live count works</h2>
<p>The counter asks YouTube's official Data API for the channel's public statistics and updates every minute. Leave the page open on a second screen during a milestone stream or launch, and the number counts up as it changes.</p>

<h2>Why the number is rounded</h2>
<p>Since 2019, YouTube only shows rounded subscriber counts publicly: three significant figures for channels over 1,000 subscribers (1.23 million is shown as 1,230,000). The API gives the same rounded number to everyone. Sites that show the count ticking up one by one are <em>estimating</em> between official updates, not showing real data. Only the channel owner can see the exact figure, in YouTube Studio.</p>

<h2>Finding a channel</h2>
<ul>
<li><strong>Handle:</strong> the @name shown on the channel page, such as @YouTube.</li>
<li><strong>Channel link:</strong> paste youtube.com/@name or youtube.com/channel/UC… directly.</li>
<li><strong>Channel ID:</strong> a 24-character code starting with UC, found in the channel's "About" → "Share channel" menu.</li>
</ul>

<h2>Share a live counter</h2>
<p>After you search, the page address includes the channel, so you can bookmark it or share it with fans to watch the count together.</p>

<h2>Hidden subscriber counts</h2>
<p>Creators can hide their subscriber count in YouTube settings. If they do, the API returns no number and the counter shows "Hidden"; views and video counts are still available.</p>

<h2>Growing a channel</h2>
<p>Subscribers follow consistently useful videos. Strong thumbnails and titles get the click (check yours with the YouTube Thumbnail Downloader and Character Counter), and a clear reason to subscribe at the end keeps viewers coming back.</p>`,
  faqs: [
    ['How can I see a YouTube channel’s live subscriber count?', 'Enter the channel’s @handle or link. The count loads from YouTube and refreshes every 60 seconds.'],
    ['Why doesn’t the count change one by one?', 'YouTube rounds public subscriber counts, so they only change when the rounded figure changes. Counters that tick every second are estimating.'],
    ['How do I find a channel ID?', 'Open the channel, go to About, choose Share channel and Copy channel ID. It starts with UC.'],
    ['Why does it say Hidden?', 'The creator has chosen to hide their subscriber count on YouTube.'],
    ['Is this data official?', 'Yes. It comes from the official YouTube Data API.'],
  ],
};
