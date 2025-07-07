/**
 * AEM EDS Interview Prep
 * Navigation JavaScript
 */

/**
 * Initialize the navigation with questions data
 * @param {Object} data - Questions data object
 */
function initNavigation(data) {
    // Populate each category with questions
    for (const category in data) {
        populateCategoryQuestions(category, data[category]);
    }
}

/**
 * Populate a category with questions
 * @param {string} category - Category name (easy, medium, hard)
 * @param {Array} questions - Array of question objects
 */
function populateCategoryQuestions(category, questions) {
    const categoryList = document.getElementById(`${category}-questions`);
    
    // Clear existing items
    categoryList.innerHTML = '';
    
    // Add each question to the list
    questions.forEach(question => {
        const listItem = document.createElement('li');
        listItem.className = 'spectrum-SideNav-item';
        listItem.setAttribute('data-question-id', question.id);
        listItem.textContent = question.title;
        
        // Add click event to load the question
        listItem.addEventListener('click', () => {
            loadQuestion(question, category);
            updateSelectedQuestion(question.id);
            
            // Update URL with question ID
            const url = new URL(window.location);
            url.searchParams.set('q', question.id);
            window.history.pushState({}, '', url);
            
            // Close sidebar on mobile
            if (window.innerWidth <= 576) {
                const sidebar = document.getElementById('sidebar');
                sidebar.classList.remove('active');
                
                const overlay = document.querySelector('.sidebar-overlay');
                if (overlay) {
                    overlay.classList.remove('active');
                }
            }
        });
        
        categoryList.appendChild(listItem);
    });
}

/**
 * Update the selected question in the navigation
 * @param {string} questionId - ID of the selected question
 */
function updateSelectedQuestion(questionId) {
    // Remove selected class from all items
    document.querySelectorAll('.spectrum-SideNav-item').forEach(item => {
        item.classList.remove('is-selected');
    });
    
    // Add selected class to the clicked item
    const selectedItem = document.querySelector(`.spectrum-SideNav-item[data-question-id="${questionId}"]`);
    if (selectedItem) {
        selectedItem.classList.add('is-selected');
        
        // Ensure the category is expanded
        const categoryList = selectedItem.closest('.spectrum-SideNav-itemGroup');
        if (categoryList) {
            categoryList.style.display = 'block';
            
            const categoryHeader = document.querySelector(`.category-header[data-category="${categoryList.id.split('-')[0]}"]`);
            if (categoryHeader) {
                categoryHeader.classList.remove('collapsed');
            }
        }
        
        // Scroll the item into view
        selectedItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

/**
 * Load a question into the content area
 * @param {Object} question - Question object
 * @param {string} category - Category name
 */
function loadQuestion(question, category) {
    const questionContent = document.getElementById('question-content');
    const welcomeScreen = document.getElementById('welcome-screen');
    
    // Hide welcome screen and show question content
    welcomeScreen.style.display = 'none';
    questionContent.style.display = 'block';
    
    // Format the difficulty level
    const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
    
    // Create the question content HTML
    questionContent.innerHTML = `
        <h2 class="question-title spectrum-Heading spectrum-Heading--sizeL">
            ${question.title}
            <span class="question-difficulty ${category}">${formattedCategory}</span>
        </h2>
        
        <div class="question-answer spectrum-Body spectrum-Body--sizeM">
            ${question.answer || 'No answer provided.'}
        </div>
        
        ${question.code ? `
        <div class="question-code">
            <h3 class="spectrum-Heading spectrum-Heading--sizeS">Code Example</h3>
            <pre class="code-block"><code>${escapeHtml(question.code)}</code></pre>
        </div>
        ` : ''}
    `;
    
    // Scroll to top of content
    questionContent.scrollTop = 0;
}

/**
 * Escape HTML special characters
 * @param {string} html - HTML string to escape
 * @returns {string} Escaped HTML string
 */
function escapeHtml(html) {
    if (!html) return '';
    
    try {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    } catch (error) {
        console.error('Error escaping HTML:', error);
        return html; // Return original if there's an error
    }
}
