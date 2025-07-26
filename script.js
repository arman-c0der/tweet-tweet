
// Tweet App Logic - script.js
// .js

const tweetInput = document.querySelector('#tweetInput');
const postTweetBtn = document.querySelector('#postTweet');
const charCount = document.querySelector('#charCount');
const tweetList = document.querySelector('#tweetList');

let tweets = JSON.parse(localStorage.getItem('tweets')) || [];

renderTweets();

// Live character counter
tweetInput.addEventListener('input', () => {
  const length = tweetInput.value.trim().length;
  charCount.textContent = `${length} / 255`;
  charCount.className = 'text-sm';

  if (length >= 230 && length < 255) charCount.classList.add('text-yellow-500');
  else if (length >= 255) charCount.classList.add('text-red-500');
  else charCount.classList.add('text-gray-500');

  postTweetBtn.disabled = length === 0 || length > 255;
  postTweetBtn.classList.toggle('btn-disabled', postTweetBtn.disabled);
});

// Post new tweet
postTweetBtn.addEventListener('click', () => {
  const text = tweetInput.value.trim();
  if (text.length === 0 || text.length > 255) return;

  const tweet = {
    id: Date.now(),
    content: text,
    timestamp: new Date().toLocaleString(),
  };

  tweets.unshift(tweet);
  localStorage.setItem('tweets', JSON.stringify(tweets));
  tweetInput.value = '';
  charCount.textContent = '0 / 255';
  charCount.className = 'text-sm text-gray-500';
  postTweetBtn.disabled = true;
  postTweetBtn.classList.add('btn-disabled');

  renderTweets();
});

// Render all tweets
function renderTweets() {
  tweetList.innerHTML = '';
  tweets.forEach((tweet) => {
    const tweetElm = document.createElement('div');
    tweetElm.className = 'tweet-container';
    tweetElm.setAttribute('data-id', tweet.id);
    tweetElm.innerHTML = `
      <p class="tweet-content">${escapeHTML(tweet.content)}</p>
      <div class="tweet-info">
        <span>${tweet.timestamp}</span>
        <div>
          <button class="edit-tweet edit-btn">Edit</button>
          <button class="delete-tweet delete-btn">Delete</button>
        </div>
      </div>
    `;
    tweetList.appendChild(tweetElm);
  });
}

// Tweet actions (edit, delete)
tweetList.addEventListener('click', (e) => {
  const tweetElm = e.target.closest('.tweet-container');
  const tweetId = Number(tweetElm.getAttribute('data-id'));
  const tweet = tweets.find((t) => t.id === tweetId);

  if (e.target.classList.contains('delete-tweet')) {
    if (confirm('Are you sure you want to delete this tweet?')) {
      tweets = tweets.filter((t) => t.id !== tweetId);
      localStorage.setItem('tweets', JSON.stringify(tweets));
      renderTweets();
    }
  }

  if (e.target.classList.contains('edit-tweet')) {
    enterEditMode(tweetElm, tweet);
  }
});

// Edit mode
function enterEditMode(container, tweet) {
  container.innerHTML = `
    <textarea class="edit-input">${escapeHTML(tweet.content)}</textarea>
    <div class="tweet-info">
      <span>Editing...</span>
      <div>
        <button class="save-btn">Save</button>
        <button class="cancel-btn">Cancel</button>
      </div>
    </div>
  `;

  const textarea = container.querySelector('textarea');
  const saveBtn = container.querySelector('.save-btn');
  const cancelBtn = container.querySelector('.cancel-btn');

  textarea.addEventListener('input', () => {
    const length = textarea.value.trim().length;
    textarea.classList.remove('text-yellow-500', 'text-red-500');

    if (length >= 230 && length < 255) textarea.classList.add('text-yellow-500');
    else if (length >= 255) textarea.classList.add('text-red-500');

    saveBtn.disabled = length === 0 || length > 255;
  });

  saveBtn.addEventListener('click', () => {
    const newText = textarea.value.trim();
    if (newText.length === 0 || newText.length > 255) return;

    tweet.content = newText;
    tweet.timestamp = new Date().toLocaleString();
    localStorage.setItem('tweets', JSON.stringify(tweets));
    renderTweets();
  });

  cancelBtn.addEventListener('click', () => {
    renderTweets();
  });
}

// Escape HTML to prevent XSS
function escapeHTML(str) {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}