document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const newPostBtn = document.getElementById('newPostBtn');
    const editorModal = document.getElementById('editorModal');
    const articleModal = document.getElementById('articleModal');
    const closeBtns = document.querySelectorAll('.close-modal');
    const closeArticleBtn = document.querySelector('.close-article');
    const postForm = document.getElementById('postForm');
    const blogGrid = document.getElementById('blogGrid');
    const emptyState = document.getElementById('emptyState');
    const modalTitle = document.getElementById('modalTitle');
    const savePostBtn = document.getElementById('savePostBtn');
    const articleView = document.getElementById('articleView');

    // Form Inputs
    const postIdInput = document.getElementById('postId');
    const titleInput = document.getElementById('postTitle');
    const categoryInput = document.getElementById('postCategory');
    const imageInput = document.getElementById('postImage');
    const contentInput = document.getElementById('postContent');

    // Database simulation (LocalStorage)
    const DB_KEY = 'nexus_blog_posts';

    // Default mock data if empty
    const initDB = () => {
        let posts = JSON.parse(localStorage.getItem(DB_KEY));
        if (!posts) {
            posts = [
                {
                    id: Date.now().toString(),
                    title: "The Future of Web Development in 2026",
                    category: "Development",
                    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000",
                    content: "Web development is evolving at an unprecedented pace. With AI taking center stage, the way we write and ship code has fundamentally changed. We're seeing more agentic workflows, dynamic UI generation, and a strong focus on premium web aesthetics.\n\nFrameworks are becoming lighter, and edge computing is making sites faster than ever before. Glassmorphism and immersive 3D experiences are no longer just concepts, they are the baseline for modern applications.",
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                },
                {
                    id: (Date.now() - 100000).toString(),
                    title: "Designing for the Modern User",
                    category: "Design",
                    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1000",
                    content: "UI/UX design in 2026 goes beyond just moving pixels. It's about crafting experiences. Users demand fluid animations, dark mode as a default, and typography that makes reading a joy.\n\nMicro-interactions guide the user gracefully from one state to another. When designing, always consider how an element enters and exits the screen. It is this attention to detail that separates good apps from exceptional ones.",
                    date: new Date(Date.now() - 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                }
            ];
            localStorage.setItem(DB_KEY, JSON.stringify(posts));
        }
        return posts;
    };

    const getPosts = () => JSON.parse(localStorage.getItem(DB_KEY)) || [];
    
    const savePosts = (posts) => {
        localStorage.setItem(DB_KEY, JSON.stringify(posts));
        renderPosts();
    };

    // Render Posts
    const renderPosts = () => {
        const posts = getPosts();
        blogGrid.innerHTML = '';

        if (posts.length === 0) {
            emptyState.classList.remove('hidden');
            blogGrid.classList.add('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        blogGrid.classList.remove('hidden');

        // Sort posts by date (newest first based on array order since we push new ones to front)
        posts.forEach(post => {
            const card = document.createElement('article');
            card.className = 'blog-card';
            
            // Create a short excerpt from content
            const excerpt = post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content;

            card.innerHTML = `
                <div class="card-image-wrap" onclick="openArticle('${post.id}')">
                    <span class="card-category">${post.category}</span>
                    <img src="${post.image}" alt="${post.title}" class="card-image" onerror="this.src='https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000'">
                </div>
                <div class="card-content">
                    <div class="card-date">${post.date}</div>
                    <h3 class="card-title" onclick="openArticle('${post.id}')">${post.title}</h3>
                    <p class="card-excerpt">${excerpt}</p>
                    <div class="card-actions">
                        <button class="btn secondary-btn" onclick="openArticle('${post.id}')">Read More</button>
                        <div class="action-group">
                            <button class="icon-btn" onclick="editPost('${post.id}')" title="Edit Post">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </button>
                            <button class="icon-btn" onclick="deletePost('${post.id}')" title="Delete Post">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            blogGrid.appendChild(card);
        });
    };

    // Modal Operations
    const openEditor = (isEdit = false) => {
        modalTitle.textContent = isEdit ? 'Edit Post' : 'Create New Post';
        savePostBtn.textContent = isEdit ? 'Update Post' : 'Publish Post';
        editorModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    const closeEditor = () => {
        editorModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        postForm.reset();
        postIdInput.value = '';
    };

    // CRUD Operations
    window.editPost = (id) => {
        const posts = getPosts();
        const post = posts.find(p => p.id === id);
        if (post) {
            postIdInput.value = post.id;
            titleInput.value = post.title;
            categoryInput.value = post.category;
            imageInput.value = post.image;
            contentInput.value = post.content;
            openEditor(true);
        }
    };

    window.deletePost = (id) => {
        if(confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            let posts = getPosts();
            posts = posts.filter(p => p.id !== id);
            savePosts(posts);
        }
    };

    window.openArticle = (id) => {
        const posts = getPosts();
        const post = posts.find(p => p.id === id);
        if(post) {
            articleView.innerHTML = `
                <img src="${post.image}" alt="${post.title}" class="article-header-img" onerror="this.src='https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000'">
                <div class="article-body-inner">
                    <div class="article-meta">
                        <span class="card-category" style="position:static;">${post.category}</span>
                        <span>Published on ${post.date}</span>
                    </div>
                    <h1>${post.title}</h1>
                    <div class="article-text">${post.content}</div>
                </div>
            `;
            articleModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    };

    // Event Listeners
    newPostBtn.addEventListener('click', () => {
        postForm.reset();
        postIdInput.value = '';
        openEditor(false);
    });

    closeBtns.forEach(btn => btn.addEventListener('click', closeEditor));
    
    closeArticleBtn.addEventListener('click', () => {
        articleModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });

    // Close modals on backdrop click
    editorModal.querySelector('.modal-backdrop').addEventListener('click', closeEditor);
    articleModal.querySelector('.article-backdrop').addEventListener('click', () => {
        articleModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });

    // Form Submit (Create/Update)
    postForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = postIdInput.value;
        const newPost = {
            id: id ? id : Date.now().toString(),
            title: titleInput.value.trim(),
            category: categoryInput.value,
            image: imageInput.value.trim(),
            content: contentInput.value.trim(),
            date: id ? getPosts().find(p => p.id === id).date : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };

        let posts = getPosts();
        if (id) {
            // Update existing
            const index = posts.findIndex(p => p.id === id);
            if (index !== -1) posts[index] = newPost;
        } else {
            // Add new at the beginning
            posts.unshift(newPost);
        }

        savePosts(posts);
        closeEditor();
    });

    // Initialize
    initDB();
    renderPosts();
});
