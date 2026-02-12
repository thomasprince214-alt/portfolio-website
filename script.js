const API_BASE_URL = 'http://localhost:5000';

// Load initial data when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadSkills();
    loadProjects();
    setupFormListeners();
});

// Load skills from API
async function loadSkills() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/skills`);
        const skills = await response.json();
        displaySkills(skills);
    } catch (error) {
        console.error('Error loading skills:', error);
    }
}

// Display skills on the page
function displaySkills(skills) {
    const skillsList = document.getElementById('skillsList');
    skillsList.innerHTML = '';
    
    skills.forEach(skill => {
        const skillCard = document.createElement('div');
        skillCard.className = 'skill-card';
        skillCard.innerHTML = `<p>${skill}</p>`;
        skillsList.appendChild(skillCard);
    });
}

// Load projects from API
async function loadProjects() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/projects`);
        const projects = await response.json();
        displayProjects(projects);
    } catch (error) {
        console.error('Error loading projects:', error);
        // Display sample projects if API fails
        displaySampleProjects();
    }
}

// Display sample projects (for demo purposes)
function displaySampleProjects() {
    const sampleProjects = [
        {
            _id: '1',
            title: 'Portfolio Website',
            description: 'A full-stack portfolio website built with Node.js, Express, and MongoDB. Features a contact form and project showcase.',
            link: '#',
            technologies: ['Node.js', 'Express', 'MongoDB', 'JavaScript']
        },
        {
            _id: '2',
            title: 'E-Commerce Platform',
            description: 'A complete e-commerce application with product catalogue, shopping cart, and payment integration.',
            link: '#',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe']
        },
        {
            _id: '3',
            title: 'Task Management App',
            description: 'A collaborative task management tool with real-time updates and team collaboration features.',
            link: '#',
            technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io']
        }
    ];
    displayProjects(sampleProjects);
}

// Display projects on the page
function displayProjects(projects) {
    const projectsList = document.getElementById('projectsList');
    projectsList.innerHTML = '';
    
    if (projects.length === 0) {
        projectsList.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No projects yet. Add your first project!</p>';
        return;
    }
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        const techTags = project.technologies
            .map(tech => `<span class="tech-tag">${tech}</span>`)
            .join('');
        
        projectCard.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            ${project.link && project.link !== '#' ? `<a href="${project.link}" class="project-link" target="_blank">View Project →</a>` : ''}
            <div class="tech-tags">${techTags}</div>
        `;
        projectsList.appendChild(projectCard);
    });
}

// Setup form listeners
function setupFormListeners() {
    // Contact form
    document.getElementById('contactForm').addEventListener('submit', handleContactSubmit);
    
    // Project form
    document.getElementById('projectForm').addEventListener('submit', handleProjectSubmit);
}

// Handle contact form submission
async function handleContactSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/contacts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, message })
        });
        
        const result = await response.json();
        
        const messageStatus = document.getElementById('messageStatus');
        if (response.ok) {
            messageStatus.className = 'message-status success';
            messageStatus.textContent = result.message || 'Message sent successfully!';
            document.getElementById('contactForm').reset();
        } else {
            messageStatus.className = 'message-status error';
            messageStatus.textContent = result.error || 'Failed to send message. Please try again.';
        }
    } catch (error) {
        console.error('Error sending message:', error);
        const messageStatus = document.getElementById('messageStatus');
        messageStatus.className = 'message-status error';
        messageStatus.textContent = 'Error: Unable to connect to server. Make sure the server is running on http://localhost:5000';
    }
}

// Handle project form submission
async function handleProjectSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('projectTitle').value;
    const description = document.getElementById('projectDescription').value;
    const link = document.getElementById('projectLink').value;
    const technologiesInput = document.getElementById('projectTech').value;
    const technologies = technologiesInput.split(',').map(tech => tech.trim());
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, link, technologies })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Reset form
            document.getElementById('projectForm').reset();
            
            // Reload projects
            loadProjects();
            
            // Show success message
            alert(result.message || 'Project added successfully!');
        } else {
            alert(result.error || 'Failed to add project. Please try again.');
        }
    } catch (error) {
        console.error('Error adding project:', error);
        alert('Error: Unable to connect to server. Make sure the server is running on http://localhost:5000');
    }
}
