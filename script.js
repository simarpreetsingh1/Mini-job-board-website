document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const jobsContainer = document.getElementById('jobs-container');
    const loader = document.getElementById('loader');
    const searchInput = document.getElementById('search');
    const departmentSelect = document.getElementById('department');
    const jobModal = document.getElementById('job-modal');
    const closeModal = document.getElementById('close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDepartment = document.getElementById('modal-department');
    const modalLocation = document.getElementById('modal-location');
    const modalDescription = document.getElementById('modal-description');
    const applyLink = document.getElementById('apply-link');
    
    // State
    let jobs = [];
    
    // Fetch jobs from API
    async function fetchJobs() {
        try {
            loader.style.display = 'block';
            jobsContainer.style.display = 'none';
            
            // In a real app, this would be an actual API call
            // For this demo, we're using a mock response
            const response = await fetch('jobs.json');
            jobs = await response.json();
            
            displayJobs(jobs);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            jobsContainer.innerHTML = '<p class="no-jobs">Failed to load jobs. Please try again later.</p>';
        } finally {
            loader.style.display = 'none';
            jobsContainer.style.display = 'grid';
        }
    }
    
    // Display jobs in the UI
    function displayJobs(jobsToDisplay) {
        if (jobsToDisplay.length === 0) {
            jobsContainer.innerHTML = '<p class="no-jobs">No jobs found matching your criteria.</p>';
            return;
        }
        
        jobsContainer.innerHTML = jobsToDisplay.map(job => `
            <div class="job-card" data-id="${job.id}">
                <h3 class="job-title">${job.title}</h3>
                <div class="job-meta">
                    <span>${job.department}</span>
                    <span>${job.location}</span>
                </div>
                <button class="apply-button" data-id="${job.id}">Apply</button>
            </div>
        `).join('');
        
        // Add event listeners to apply buttons
        document.querySelectorAll('.apply-button').forEach(button => {
            button.addEventListener('click', function() {
                const jobId = parseInt(this.getAttribute('data-id'));
                openJobModal(jobId);
            });
        });
    }
    
    // Filter jobs based on search and department
    function filterJobs() {
        const searchTerm = searchInput.value.toLowerCase();
        const department = departmentSelect.value;
        
        const filteredJobs = jobs.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchTerm);
            const matchesDepartment = department === '' || job.department === department;
            return matchesSearch && matchesDepartment;
        });
        
        displayJobs(filteredJobs);
    }
    
    // Open job modal with details
    function openJobModal(jobId) {
        const job = jobs.find(job => job.id === jobId);
        if (!job) return;
        
        modalTitle.textContent = job.title;
        modalDepartment.textContent = job.department;
        modalLocation.textContent = job.location;
        modalDescription.textContent = job.description;
        applyLink.href = `#apply-${job.id}`; // In a real app, this would be a proper apply URL
        
        jobModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Close job modal
    function closeJobModal() {
        jobModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Initialize theme toggle (bonus feature)
    function initThemeToggle() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
        themeToggle.setAttribute('aria-label', 'Toggle dark mode');
        document.body.appendChild(themeToggle);
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }
    
    // Event listeners
    searchInput.addEventListener('input', filterJobs);
    departmentSelect.addEventListener('change', filterJobs);
    closeModal.addEventListener('click', closeJobModal);
    jobModal.addEventListener('click', function(e) {
        if (e.target === jobModal) closeJobModal();
    });
    
    // Keyboard accessibility
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && jobModal.classList.contains('active')) {
            closeJobModal();
        }
    });
    
    // Initialize
    fetchJobs();
    initThemeToggle();
});