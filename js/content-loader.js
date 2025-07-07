/**
 * AEM EDS Interview Prep
 * Content Loader JavaScript
 */

/**
 * Add CSS styles for question difficulty badges
 */
(function addDifficultyStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .question-difficulty {
            display: inline-block;
            font-size: 0.75rem;
            padding: 4px 8px;
            border-radius: 4px;
            margin-left: 12px;
            vertical-align: middle;
            font-weight: 500;
        }
        
        .question-difficulty.easy {
            background-color: #E3FCEF;
            color: #08A573;
        }
        
        .question-difficulty.medium {
            background-color: #FFF0E3;
            color: #E68619;
        }
        
        .question-difficulty.hard {
            background-color: #FFEAEA;
            color: #D7373F;
        }
        
        .code-block {
            position: relative;
            background-color: #f5f5f5;
            border-radius: 4px;
            padding: 16px;
            margin: 16px 0;
        }
        
        .code-block code {
            display: block;
            white-space: pre;
            overflow-x: auto;
            font-family: monospace;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .copy-button {
            position: absolute;
            top: 8px;
            right: 8px;
        }
    `;
    document.head.appendChild(style);
})();

/**
 * Add copy button to code blocks
 */
function addCopyButtons() {
    document.querySelectorAll('.code-block').forEach(codeBlock => {
        // Skip if already has a copy button
        if (codeBlock.querySelector('.copy-button')) {
            return;
        }
        
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'spectrum-Button spectrum-Button--primary spectrum-Button--quiet copy-button';
        copyButton.innerHTML = '<span class="spectrum-Button-label">Copy</span>';
        
        // Add click event to copy code
        copyButton.addEventListener('click', () => {
            const code = codeBlock.querySelector('code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                copyButton.innerHTML = '<span class="spectrum-Button-label">Copied!</span>';
                setTimeout(() => {
                    copyButton.innerHTML = '<span class="spectrum-Button-label">Copy</span>';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy code:', err);
            });
        });
        
        codeBlock.appendChild(copyButton);
    });
}

/**
 * Process code blocks when they are added to the DOM
 */
document.addEventListener('DOMContentLoaded', () => {
    // Process any code blocks that exist on page load
    setTimeout(() => {
        addCopyButtons();
    }, 100);
    
    // Set up a listener for question content changes
    const questionContent = document.getElementById('question-content');
    if (questionContent) {
        questionContent.addEventListener('DOMNodeInserted', (event) => {
            // Wait a bit to ensure the DOM is stable
            setTimeout(() => {
                addCopyButtons();
            }, 100);
        });
    }
});
