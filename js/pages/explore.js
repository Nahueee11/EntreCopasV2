// Explore Page Module
export function initExplore() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const filterItems = document.querySelectorAll('.filter-item');
    const searchInput = document.getElementById('winery-search');

    if (filterBtns.length > 0 || searchInput) {
        function filterWineries() {
            const activeBtn = document.querySelector('.filter-btn.active');
            const filterValue = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
            const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

            filterItems.forEach(item => {
                const category = item.getAttribute('data-category');
                const titleEl = item.querySelector('h3');
                const title = titleEl ? titleEl.textContent.toLowerCase() : '';
                const descEl = item.querySelector('p');
                const description = descEl ? descEl.textContent.toLowerCase() : '';
                const regionEl = item.querySelector('.label-caps');
                const region = regionEl ? regionEl.textContent.toLowerCase() : '';

                const matchesCategory = (filterValue === 'all' || category === filterValue);
                const matchesSearch = (!query || title.includes(query) || description.includes(query) || region.includes(query));

                if (matchesCategory && matchesSearch) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });

            // Handle empty state if no wineries match search/filters
            let visibleCount = 0;
            filterItems.forEach(item => {
                const category = item.getAttribute('data-category');
                const titleEl = item.querySelector('h3');
                const title = titleEl ? titleEl.textContent.toLowerCase() : '';
                const descEl = item.querySelector('p');
                const description = descEl ? descEl.textContent.toLowerCase() : '';
                const regionEl = item.querySelector('.label-caps');
                const region = regionEl ? regionEl.textContent.toLowerCase() : '';
                
                if ((filterValue === 'all' || category === filterValue) && (!query || title.includes(query) || description.includes(query) || region.includes(query))) {
                    visibleCount++;
                }
            });

            let emptyMessage = document.getElementById('search-empty-message');
            if (visibleCount === 0) {
                if (!emptyMessage) {
                    emptyMessage = document.createElement('div');
                    emptyMessage.id = 'search-empty-message';
                    emptyMessage.className = 'empty-state';
                    emptyMessage.style.gridColumn = '1 / -1';
                    emptyMessage.style.marginTop = 'var(--space-md)';
                    emptyMessage.innerHTML = `
                        <p>No se encontraron bodegas que coincidan con la búsqueda.</p>
                        <button class="btn btn-ghost" id="clear-search-btn" style="margin-top: var(--space-sm);">Limpiar Búsqueda</button>
                    `;
                    const exploreGrid = document.getElementById('explore-grid');
                    if (exploreGrid) {
                        exploreGrid.appendChild(emptyMessage);
                    }
                    
                    const clearBtn = document.getElementById('clear-search-btn');
                    if (clearBtn) {
                        clearBtn.addEventListener('click', () => {
                            if (searchInput) searchInput.value = '';
                            filterWineries();
                        });
                    }
                }
            } else {
                if (emptyMessage) {
                    emptyMessage.remove();
                }
            }
        }

        if (filterBtns.length > 0) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    filterWineries();
                });
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', filterWineries);
        }

        // Auto-select bodega if passed in URL query param
        const urlParams = new URLSearchParams(window.location.search);
        const bodegaParam = urlParams.get('bodega');
        if (bodegaParam) {
            const selectEl = document.getElementById('bodega');
            if (selectEl) {
                for (let i = 0; i < selectEl.options.length; i++) {
                    if (selectEl.options[i].value.toLowerCase().includes(bodegaParam.toLowerCase())) {
                        selectEl.selectedIndex = i;
                        break;
                    }
                }
            }
        }
    }
}
