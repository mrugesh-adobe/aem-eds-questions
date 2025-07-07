/**
 * AEM EDS Interview Prep
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    initApp();
});

/**
 * Initialize the application
 */
function initApp() {
    // Load questions data
    loadQuestionsData()
        .then(data => {
            // Store questions data in a global variable
            window.questionsData = data;
            
            // Initialize the navigation
            initNavigation(data);
            
            // Check for URL parameters to load specific question
            const urlParams = new URLSearchParams(window.location.search);
            const questionId = urlParams.get('q');
            
            if (questionId) {
                // Find the question in the data
                let foundQuestion = null;
                let foundCategory = null;
                
                for (const category in data) {
                    const question = data[category].find(q => q.id === questionId);
                    if (question) {
                        foundQuestion = question;
                        foundCategory = category;
                        break;
                    }
                }
                
                if (foundQuestion) {
                    // Load the question
                    loadQuestion(foundQuestion, foundCategory);
                    
                    // Update the navigation
                    updateSelectedQuestion(questionId);
                } else {
                    // Question not found, show welcome screen
                    showWelcomeScreen();
                }
            } else {
                // No question specified, show welcome screen
                showWelcomeScreen();
            }
        })
        .catch(error => {
            console.error('Error loading questions data:', error);
            showErrorMessage('Failed to load questions data. Please try again later.');
        });
}

/**
 * Load questions data from JSON file
 * @returns {Promise} Promise that resolves with the questions data
 */
function loadQuestionsData() {
    return fetch('data/questions.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load questions data');
            }
            return response.json();
        });
}

/**
 * Show welcome screen
 */
function showWelcomeScreen() {
    document.getElementById('welcome-screen').style.display = 'block';
    document.getElementById('question-content').style.display = 'none';
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showErrorMessage(message) {
    const welcomeScreen = document.getElementById('welcome-screen');
    welcomeScreen.innerHTML = `
        <h2 class="spectrum-Heading spectrum-Heading--sizeXL">Error</h2>
        <p class="spectrum-Body spectrum-Body--sizeL">${message}</p>
        <button class="spectrum-Button spectrum-Button--primary" onclick="location.reload()">
            <span class="spectrum-Button-label">Reload</span>
        </button>
    `;
    welcomeScreen.style.display = 'block';
    document.getElementById('question-content').style.display = 'none';
}

/**
 * Handle mobile menu toggle
 */
document.getElementById('mobile-menu-toggle').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
    
    // Create or remove overlay
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.querySelector('.main-container').appendChild(overlay);
    }
    
    overlay.classList.toggle('active');
    
    // Add click event to close sidebar when overlay is clicked
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
});

/**
 * Handle sidebar close button
 */
document.getElementById('sidebar-close').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('active');
    
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
});

/**
 * Add event listeners for category headers
 */
document.querySelectorAll('.category-header').forEach(header => {
    header.addEventListener('click', () => {
        const category = header.getAttribute('data-category');
        const questionsList = document.getElementById(`${category}-questions`);
        
        header.classList.toggle('collapsed');
        
        if (header.classList.contains('collapsed')) {
            questionsList.style.display = 'none';
        } else {
            questionsList.style.display = 'block';
        }
    });
});
