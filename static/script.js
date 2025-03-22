// API-related buttons
const fetchConversationsButton = document.getElementById('fetch-conversations');
const fetchFactsButton = document.getElementById('fetch-facts');
const fetchTodosButton = document.getElementById('fetch-todos');

// Database-related buttons
const dbConversationsButton = document.getElementById('db-conversations');
const dbFactsButton = document.getElementById('db-facts');
const dbTodosButton = document.getElementById('db-todos');

// Function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}



// Function to create a card element
function createCard(item, type) {
    const card = document.createElement('div');
    card.className = 'card';

    let content = '';
    switch(type) {
        case 'conversations':
            content = `
                <h4>${item.Title || 'Conversation'}</h4>
                <p>${item.Summary || 'No summary available'}</p>
                <div class="timestamp">Created: ${formatDate(item['Created At'])}</div>
            `;
            break;
        case 'facts':
            content = `
                <h4>Fact</h4>
                <p>${item.Text}</p>
            `;
            break;
        case 'todos':
            content = `
                <h4>${item.Task}</h4>
                <div class="status ${item.Completed === 'Yes' ? 'completed' : 'pending'}">
                    ${item.Completed === 'Yes' ? 'Completed' : 'Pending'}
                </div>
            `;
            break;
    }

    card.innerHTML = content;
    return card;
}

// Function to display data as cards
function displayDataAsCards(data, type) {
    const cardsContainer = document.getElementById(`${type}-cards`);
    cardsContainer.innerHTML = '';

    const items = data[type] || [];
    items.forEach(item => {
        cardsContainer.appendChild(createCard(item, type));
    });

    // Show/hide sections based on data
    document.getElementById(`${type}-section`).style.display = 
        items.length > 0 ? 'block' : 'none';
}

// API functions
async function fetchApiData(endpoint) {
    try {
        const response = await fetch(`/api/${endpoint}`);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        // Display data as cards
        displayDataAsCards(data, endpoint);
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        document.getElementById(`${endpoint}-cards`).innerHTML = 
            `<div class="error-card">Error fetching ${endpoint}: ${error.message}</div>`;
    }
}

// Database functions
async function fetchDbData(endpoint) {
    try {
        const response = await fetch(`/api/db/${endpoint}`);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        // Display data as cards and show record count
        displayDataAsCards(data, endpoint);
        
        // Add a status message showing record count
        const cardsContainer = document.getElementById(`${endpoint}-cards`);
        const countMessage = document.createElement('div');
        countMessage.className = 'db-status';
        countMessage.innerHTML = `<p>Retrieved ${data.count} records from database</p>`;
        cardsContainer.prepend(countMessage);
        
    } catch (error) {
        console.error(`Error fetching ${endpoint} from database:`, error);
        document.getElementById(`${endpoint}-cards`).innerHTML = 
            `<div class="error-card">Error fetching ${endpoint} from database: ${error.message}</div>`;
    }
}

// Event listeners for API data
fetchConversationsButton.addEventListener('click', () => fetchApiData('conversations'));
fetchFactsButton.addEventListener('click', () => fetchApiData('facts'));
fetchTodosButton.addEventListener('click', () => fetchApiData('todos'));

// Event listeners for database data
dbConversationsButton.addEventListener('click', () => fetchDbData('conversations'));
dbFactsButton.addEventListener('click', () => fetchDbData('facts'));
dbTodosButton.addEventListener('click', () => fetchDbData('todos'));