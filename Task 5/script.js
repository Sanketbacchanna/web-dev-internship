(function() {
    var storeKey = "my_custom_blog_platform_data";

    var defaultData = [
        {
            pid: "p1",
            tit: "Exploring Vanilla JavaScript",
            cat: "Programming",
            img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
            txt: "JavaScript is amazing. It allows you to build complete web applications without relying on heavy frameworks. By understanding the core mechanics of the DOM and browser APIs, developers can craft fast, lightweight experiences.",
            dt: new Date().toLocaleDateString()
        }
    ];

    function fetchData() {
        var raw = localStorage.getItem(storeKey);
        if (!raw) {
            localStorage.setItem(storeKey, JSON.stringify(defaultData));
            return defaultData;
        }
        return JSON.parse(raw);
    }

    function syncData(d) {
        localStorage.setItem(storeKey, JSON.stringify(d));
    }

    function drawGrid() {
        var d = fetchData();
        var grid = document.getElementById('blogGrid');
        grid.innerHTML = "";
        
        if (d.length === 0) {
            document.getElementById('emptyState').classList.remove('hidden');
            grid.classList.add('hidden');
            return;
        } else {
            document.getElementById('emptyState').classList.add('hidden');
            grid.classList.remove('hidden');
        }

        for (var i = 0; i < d.length; i++) {
            (function(item) {
                var art = document.createElement('article');
                art.className = 'blog-card';
                
                var shortTxt = item.txt.length > 100 ? item.txt.substring(0, 100) + "..." : item.txt;

                art.innerHTML = `
                    <div class="card-image-wrap" style="cursor:pointer">
                        <span class="card-category">${item.cat}</span>
                        <img src="${item.img}" class="card-image">
                    </div>
                    <div class="card-content">
                        <div class="card-date">${item.dt}</div>
                        <h3 class="card-title" style="cursor:pointer">${item.tit}</h3>
                        <p class="card-excerpt">${shortTxt}</p>
                        <div class="card-actions">
                            <button class="btn secondary-btn read-btn">Read More</button>
                            <div class="action-group">
                                <button class="icon-btn edit-btn">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </button>
                                <button class="icon-btn del-btn">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                `;

                // events
                art.querySelector('.card-image-wrap').onclick = art.querySelector('.card-title').onclick = art.querySelector('.read-btn').onclick = function() {
                    openView(item);
                };
                
                art.querySelector('.edit-btn').onclick = function() {
                    openForm(item);
                };
                
                art.querySelector('.del-btn').onclick = function() {
                    if (confirm("Delete this?")) {
                        syncData(fetchData().filter(function(x) { return x.pid !== item.pid; }));
                        drawGrid();
                    }
                };

                grid.appendChild(art);
            })(d[i]);
        }
    }

    function openForm(existing) {
        document.getElementById('editorModal').classList.remove('hidden');
        var form = document.getElementById('postForm');
        form.reset();
        
        if (existing) {
            document.getElementById('modalTitle').innerText = "Update Entry";
            document.getElementById('postId').value = existing.pid;
            document.getElementById('postTitle').value = existing.tit;
            document.getElementById('postCategory').value = existing.cat;
            document.getElementById('postImage').value = existing.img;
            document.getElementById('postContent').value = existing.txt;
        } else {
            document.getElementById('modalTitle').innerText = "Create Entry";
            document.getElementById('postId').value = "";
        }
    }

    function openView(item) {
        var view = document.getElementById('articleView');
        view.innerHTML = `
            <img src="${item.img}" class="article-header-img">
            <div class="article-body-inner">
                <div class="article-meta">
                    <span class="card-category" style="position:static">${item.cat}</span>
                    <span>${item.dt}</span>
                </div>
                <h1>${item.tit}</h1>
                <div class="article-text">${item.txt.replace(/\n/g, '<br>')}</div>
            </div>
        `;
        document.getElementById('articleModal').classList.remove('hidden');
    }

    window.addEventListener('load', function() {
        drawGrid();

        document.getElementById('newPostBtn').onclick = function() {
            openForm(null);
        };

        var closers = document.querySelectorAll('.close-modal');
        for (var i = 0; i < closers.length; i++) {
            closers[i].onclick = function() {
                document.getElementById('editorModal').classList.add('hidden');
            };
        }
        
        document.querySelector('.close-article').onclick = function() {
            document.getElementById('articleModal').classList.add('hidden');
        };

        document.getElementById('postForm').onsubmit = function(e) {
            e.preventDefault();
            var d = fetchData();
            var id = document.getElementById('postId').value;
            
            var payload = {
                tit: document.getElementById('postTitle').value,
                cat: document.getElementById('postCategory').value,
                img: document.getElementById('postImage').value,
                txt: document.getElementById('postContent').value,
            };

            if (id) {
                for (var j=0; j<d.length; j++) {
                    if (d[j].pid === id) {
                        d[j].tit = payload.tit;
                        d[j].cat = payload.cat;
                        d[j].img = payload.img;
                        d[j].txt = payload.txt;
                    }
                }
            } else {
                payload.pid = 'post_' + new Date().getTime();
                payload.dt = new Date().toLocaleDateString();
                d.unshift(payload);
            }

            syncData(d);
            document.getElementById('editorModal').classList.add('hidden');
            drawGrid();
        };
    });
})();
